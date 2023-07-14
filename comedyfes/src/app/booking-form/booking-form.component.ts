import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
})
export class BookingFormComponent implements OnInit {
  eventId!: string;
  event: any;
  user: any;
  booking: any = {};

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.booking = {
      user: null,
      event: null,
      quantity: 0
    };
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId') || ''; 
    this.getEvent();
    this.getUser();
  }
  getUser() {
    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        this.booking.user = user;
      },
      (error: any) => {
        console.error('Failed to fetch current user:', error);
      }
    );
  }
  getEvent() {
    this.eventService.getEventById(this.eventId).subscribe(
      (response: any) => {
        this.event = response;
      },
      (error: any) => {
        console.error('Failed to fetch event details:', error);
      }
    );
  }
  submitBookingForm() {
    const { user, event, quantity } = this.booking;
    
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    else{
    this.bookingService.createBooking(user, event, quantity).subscribe(
      (response) => {
        console.log('Booking created:', response);
        // Reset the booking form
      },
      (error) => {
        console.error('Failed to create booking:', error);
      }
    );
  }
}
}
