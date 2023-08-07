import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { EventService } from '../event-service.service';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, map, takeUntil, catchError } from 'rxjs/operators';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { EmailService } from '../email-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: any;
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  successMessage: string = '';
  showPastEvents: boolean = false;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private eventService: EventService,
    private sanitizer: DomSanitizer,
    private emailservice: EmailService
  ) {}

  ngOnInit() {
    this.authService
      .getCurrentUser()
      .pipe(
        switchMap((response: any) => {
          this.user = response;
          return this.fetchUserBookings();
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        () => {},
        (error: any) => {
          console.error('Failed to retrieve user:', error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  fetchUserBookings() {
    const userId = this.user._id;
    return this.bookingService.getUserBookings(userId).pipe(
      switchMap((bookings: any[]) => {
        const today = new Date();
        const upcomingBookings: any[] = [];
        const pastBookings: any[] = [];

        const observables = bookings.map((booking: any) => {
          const eventId = booking.event;
          return this.eventService.getEventById(eventId).pipe(
            switchMap((eventResponse: any) => {
              if (eventResponse) {
                const eventStartDate = new Date(eventResponse.end_date);
                booking.event = eventResponse;
                return this.retrieveImage(eventId).pipe(
                  map((imageStyle: SafeStyle) => {
                    booking.event.image = imageStyle;
                    if (eventStartDate >= today) {
                      upcomingBookings.push(booking);
                    } else {
                      pastBookings.push(booking);
                    }
                    return true;
                  }),
                  catchError((error: any) => {
                    console.error('Failed to retrieve event image:', error);
                    // Handle image retrieval error here if needed
                    return of(true);
                  })
                );
              } else {
                console.error('Invalid eventResponse:', eventResponse);
                // Handle invalid eventResponse here if needed
                return of(true);
              }
            })
          );
        });

        return forkJoin(observables).pipe(
          switchMap(() => {
            this.upcomingBookings = upcomingBookings.sort(
              (a, b) =>
                new Date(a.event.start_date).getTime() -
                new Date(b.event.start_date).getTime()
            );
            this.pastBookings = pastBookings.sort(
              (a, b) =>
                new Date(b.event.start_date).getTime() -
                new Date(a.event.start_date).getTime()
            );
            return of(true);
          })
        );
      })
    );
  }

  retrieveImage(eventId: string): Observable<SafeStyle> {
    return this.eventService.getEventImageById(eventId).pipe(
      map((imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        return this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
      })
    );
  }

  onToggleUpcoming() {
    this.showPastEvents = false;
  }

  onTogglePast() {
    this.showPastEvents = true;
  }
  formatDate(date: any): string | null {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd/MM/yyyy');
  }

  isCancelable(booking: any): boolean {
    const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
    const eventStartDate = new Date(booking.event.start_date).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = eventStartDate - currentTime;

    return timeDifference > sixHoursInMilliseconds && booking.paymentIntentId;
  }
  // Inside the UserProfileComponent class
  confirmCancellation(booking: any) {
    console.log(booking);
    const cancellationFeePercentage = 15;
    const refundAmount = this.calculateRefundAmount(
      booking,
      cancellationFeePercentage
    );
    const confirmationMessage = `Are you sure you want to cancel this booking?\n\nNote: There will be a 15% cancellation fee applied on the refund amount.\n\nYou will be receiving ${refundAmount} back.`;
    const confirmed = window.confirm(confirmationMessage);

    if (confirmed) {
      this.bookingService.deleteBooking(booking).subscribe((response) => {
        this.bookingService.initiateRefund(booking.paymentIntentId).subscribe(
          (response: any) => {
            this.successMessage = `Booking canceled successfully. Refund amount: $${refundAmount.toFixed(
              2
            )}`;
            alert(this.successMessage);
            this.sendOrderByEmail(booking, refundAmount);
          },
          (error: any) => {
            console.error('Error initiating refund:', error);
            // Handle error
          }
        );
      });
    }
  }
  sendOrderByEmail(booking: any, refund: number) {
    const email = this.user.email;
    const subject = 'Booking Cancelled';
    const body = `
    <p>Your Booking has been succesfully cancelled </p>
    <p>Booking ID: ${booking._id}</p>
    <p>Paid Amount: ${booking.paid}</p>
    <p>Refund Amount: ${refund}</p>
  `;
    this.emailservice.sendOrderEmail(email, subject, body).subscribe(
      (response: any) => {},
      (error: any) => {}
    );
  }

  calculateRefundAmount(
    booking: any,
    cancellationFeePercentage: number
  ): number {
    const paidAmount = booking.paid;
    console.log(paidAmount);
    console.log(booking);
    const cancellationFee = (cancellationFeePercentage / 100) * paidAmount;
    const refundAmount = paidAmount - cancellationFee;
    console.log(refundAmount);
    return refundAmount;
  }
}
