import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  successMessage: string = '';

  constructor(private bookingService: BookingService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.fetchUserBookings();
  }

  fetchUserBookings() {
    const userId = this.user._id;
    this.bookingService.getUserBookings(userId).subscribe(
      (response: any) => {
        const today = new Date();
        const bookings = response;

        this.upcomingBookings = bookings.filter((booking: any) =>
          new Date(booking.event.start_date) >= today && booking.status === 'active'
        );

        this.pastBookings = bookings.filter((booking: any) =>
          new Date(booking.event.start_date) < today || booking.status === 'past'
        );
      },
      (error: any) => {
        // Handle error
      }
    );
  }

  cancelBooking(bookingId: string) {
    this.bookingService.cancelBooking(bookingId).subscribe(
      (response: any) => {
        this.successMessage = 'Booking cancelled successfully.';
        // Refresh the bookings after cancellation
        this.fetchUserBookings();
      },
      (error: any) => {
        // Handle cancellation error
        this.successMessage = 'Failed to cancel booking.';
      }
    );
  }
}
