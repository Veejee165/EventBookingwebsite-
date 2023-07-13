import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: any[] = [];

  constructor(private router: Router, private eventService: EventService) {}

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
      },
      (error) => {
        console.error('Failed to fetch upcoming events:', error);
      }
    );
  }
  

  goToEventDetails(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }
}
