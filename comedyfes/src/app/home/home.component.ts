import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChildren('slideImage') slideImages!: QueryList<ElementRef>;
  upcomingEvents: any[];
  filteredEvents: any[];
  eventsToday: any[];
  eventsLowAvailability: any[];
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  currentSlideIndex: number = 0;
  currentEvent: any | null = null;

  constructor(
    private router: Router,
    private eventService: EventService,
    private sanitizer: DomSanitizer
  ) {
    this.upcomingEvents = [];
    this.filteredEvents = [];
    this.eventsToday = [];
    this.eventsLowAvailability = [];
  }

  ngOnInit() {
    console.log('Home');
    this.getUpcomingEvents().subscribe(() => {
      this.startSlideInterval();
    });
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.eventService.getUpcomingEvents().pipe(
      tap((events: any[]) => {
        this.upcomingEvents = events || [];
        this.upcomingEvents.forEach((e) => {
          if (e.image) {
            this.retrieveImage(e);
            this.filterEvent(e);
          }
        });
      }),
      catchError((error: any) => {
        console.error('Error fetching upcoming events:', error);
        return of([]); // Return an empty array in case of an error
      })
    );
  }

  retrieveImage(event: any) {
    this.eventService.getEventImageById(event._id).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        event.image = this.sanitizer.bypassSecurityTrustStyle(
          `url(${imageUrl})`
        );
        event.imageURL = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        return event;
      },
      (error: any) => {
        console.error('Failed to retrieve event image:', error);
      }
    );
  }

  goToEventDetails(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
  startSlideInterval() {
    setInterval(() => {
      this.showNextSlide();
    }, 5000);
  }
  showNextSlide() {
    this.currentSlideIndex++;
    if (this.currentSlideIndex >= this.filteredEvents.length) {
      this.currentSlideIndex = 0;
    }
    this.currentEvent = this.filteredEvents[this.currentSlideIndex];
  }
  filterEvent(e: any) {
    const currentDate = new Date();
    this.filteredEvents.push(e);
    const eventStartDate = new Date(e.start_date);

    if (
      eventStartDate.getFullYear() === currentDate.getFullYear() &&
      eventStartDate.getMonth() === currentDate.getMonth() &&
      eventStartDate.getDate() === currentDate.getDate()
    ) {
      this.eventsToday.push(e);
    }
    if (e.ticket_quantity < 40) {
      this.eventsLowAvailability.push(e);
    }
  }
}
