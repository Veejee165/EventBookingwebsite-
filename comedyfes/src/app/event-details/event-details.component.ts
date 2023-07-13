import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId!: string;
  event: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.getEventDetails();
  }

  getEventDetails() {
    this.eventService.getEventById(this.eventId).subscribe(
      (event) => {
        this.event = event;
      },
      (error) => {
        console.error('Failed to fetch event details:', error);
      }
    );
  }

  goToBookingForm() {
    this.router.navigate(['/booking', this.eventId]);
  }
}
