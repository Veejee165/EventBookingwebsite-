import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.component.html'
  // styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  events: any[] = []; // Array to store the events
  bookings: any[] = []; // Array to store the bookings

  constructor(
    private router: Router,
    private eventService: EventService, // Service for event-related operations
    private bookingService: BookingService // Service for booking-related operations
  ) {}

  ngOnInit() {
    this.getEvents();
    this.getBookings();
  }

  // Fetch events from the backend API
  getEvents() {
    this.eventService.getAllEvents().subscribe(
      (response: any) => {
        this.events = response;
      },
      (error: any) => {
        console.error('Failed to fetch events:', error);
      }
    );
  }

  // Delete an event
  deleteEvent(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe(
        (response: any) => {
          console.log('Event deleted successfully');
          this.getEvents(); // Refresh the events list
        },
        (error: any) => {
          console.error('Failed to delete event:', error);
        }
      );
    }
  }

  // Fetch bookings from the backend API
  getBookings() {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.bookings = response;
      },
      (error: any) => {
        console.error('Failed to fetch bookings:', error);
      }
    );
  }
  // Delete a booking
  deleteBooking(bookingId: string) {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(bookingId).subscribe(
        (response: any) => {
          console.log('Booking deleted successfully');
          this.getBookings(); // Refresh the bookings list
        },
        (error: any) => {
          console.error('Failed to delete booking:', error);
        }
      );
    }
  }
}
