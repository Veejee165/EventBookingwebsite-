import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  eventId!: string;
  event: any;
  booking: any = {};
  showTick: boolean = false;

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
    this.authService.getCurrentUser().subscribe((response: any) => {
      console.log(response);
      this.booking.user = response;
    },
    (error: any) => {
    });
  }

  getEvent() {
    this.eventService.getEventById(this.eventId).subscribe(
      (response: any) => {
        this.event = response;
        this.booking.event = response;
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

    this.bookingService.createBooking(user, event, quantity).subscribe(
      (response) => {
        console.log('Booking created:', response);
        this.showTick = true;
        setTimeout(() => {
          this.showTick = false;
          this.router.navigate(['/']); // Replace '/' with the desired home page route
        }, 3000);
      },
      (error) => {
        console.error('Failed to create booking:', error);
      }
    );
  }
}
