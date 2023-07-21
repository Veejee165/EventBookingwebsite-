import { Component, OnInit,Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private eventService: EventService,private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.getUpcomingEvents();
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
}
