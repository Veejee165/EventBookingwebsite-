import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html'
  // styleUrls: ['./booking-form.css']
})
export class BookingFormComponent implements OnInit {
  eventId!: string;
  event: any;
  booking: any = {};

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || ''; 
    this.getEventDetails();
  }

  // Fetch event details from the backend API
  getEventDetails() {
    this.eventService.getEventById(this.eventId).subscribe(
      (response: any) => {
        this.event = response;
      },
      (error: any) => {
        console.error('Failed to fetch event details:', error);
      }
    );
  }

  // Submit the booking form
  submitBookingForm() {
    const { user, event, quantity } = this.booking;

    this.bookingService.createBooking(user, event, quantity).subscribe(
      (response) => {
        console.log('Booking created:', response);
        // Reset the booking form
        this.booking = {};
      },
      (error) => {
        console.error('Failed to create booking:', error);
      }
    );
  }
}
 