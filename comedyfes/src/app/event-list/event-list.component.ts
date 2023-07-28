import { Component, OnInit,Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Import DomSanitizer


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
@Injectable({
  providedIn: 'root',
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  searchEventName: string = '';
  searchLocation: string = '';
  searchEventCategory : string = '';
  categories: string[] = ['Comedy', 'Drama', 'Movie', 'Concert']; // Add available categories
  filteredEvents : any[] = [];

  constructor(private router: Router, private eventService: EventService,private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute ) {}

  ngOnInit() {
    this.getUpcomingEvents();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchEventCategory = params['category'] || '';
      this.searchEvents();
    });
  }

  getUpcomingEvents() {
    this.eventService.getUpcomingEvents().subscribe(
      (events) => {
        // Filter out events with no quantity left and whose date has already passed
        const currentDate = new Date();
        this.events = events.filter(event =>
          event.ticket_quantity > 0 && new Date(event.end_date) >= currentDate
        );
        this.events.forEach(event => {
          this.retrieveImage(event);
        });
        this.filteredEvents = this.events.slice();
      },
      (error) => {
        console.error('Failed to fetch upcoming events:', error);
      }
    );
  }
  

  goToEventDetails(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
  retrieveImage(event: any) {
    this.eventService.getEventImageById(event._id).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        event.image = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      },
      (error: any) => {
        console.error('Failed to retrieve event image:', error);
      }
    );
  }
    searchEvents() {
    this.filteredEvents = this.events?.filter((event) =>
      event.title.toLowerCase().includes(this.searchEventName.toLowerCase()) &&
      (this.searchEventCategory === '' || event.category.toLowerCase().includes(this.searchEventCategory.toLowerCase()))&&
      (event.city.toLowerCase().includes(this.searchLocation.toLowerCase()) ||
        event.state.toLowerCase().includes(this.searchLocation.toLowerCase()) ||
        event.country.toLowerCase().includes(this.searchLocation.toLowerCase()))
    ) || [];
  }
}
