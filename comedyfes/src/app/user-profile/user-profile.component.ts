import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { EventService } from '../event-service.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
  activeTab: string = 'upcoming';
  showPastEvents: boolean = false; // Add this line to define the property

  constructor(private bookingService: BookingService, private authService: AuthService, private eventService: EventService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      (response: any) => {
        console.log(response);
        this.user = response;
        this.fetchUserBookings();
      },
      (error: any) => {
        console.error('Failed to retrieve user:', error);
      }
    );
  }
  
  changeTab(tab: string) {
    this.activeTab = tab;
  }

  getUser() {
    this.authService.getCurrentUser().subscribe((response: any) => {
      console.log(response);
      this.user = response;
    },
      (error: any) => {
      });
  }

  fetchUserBookings() {
    const userId = this.user._id;
    this.bookingService.getUserBookings(userId).subscribe(
      (bookings: any[]) => {
        const today = new Date();
        const upcomingBookings: any[] = [];
        const pastBookings: any[] = [];

        // Iterate through the bookings array
        for (const booking of bookings) {
          const eventId = booking.event;

          // Retrieve event details for the current booking
          this.eventService.getEventById(eventId).subscribe(
            (eventResponse: any) => {
              const eventStartDate = new Date(eventResponse.start_date);

              if (eventStartDate >= today) {
                // Add to upcoming bookings if event start date is in the future
                upcomingBookings.push({ booking, event: eventResponse });
              } else {
                // Add to past bookings if event start date is in the past
                pastBookings.push({ booking, event: eventResponse });
              }
            },
            (error: any) => {
              console.error('Failed to retrieve event:', error);
            }
          );
        }

        this.upcomingBookings = upcomingBookings;
        this.pastBookings = pastBookings;
      },
      (error: any) => {
        console.error('Failed to retrieve user bookings:', error);
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
