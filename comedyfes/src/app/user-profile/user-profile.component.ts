import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { EventService } from '../event-service.service';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, map, takeUntil, catchError } from 'rxjs/operators';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser()
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
    return this.bookingService.getUserBookings(userId)
      .pipe(
        switchMap((bookings: any[]) => {
          const today = new Date();
          const upcomingBookings: any[] = [];
          const pastBookings: any[] = [];

          const observables = bookings.map((booking: any) => {
            const eventId = booking.event;
            return this.eventService.getEventById(eventId).pipe(
              switchMap((eventResponse: any) => {
                if (eventResponse) {
                  const eventStartDate = new Date(eventResponse.start_date);
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

          return forkJoin(observables)
            .pipe(
              switchMap(() => {
                this.upcomingBookings = upcomingBookings.sort(
                  (a, b) => new Date(a.event.start_date).getTime() - new Date(b.event.start_date).getTime()
                );
                this.pastBookings = pastBookings.sort(
                  (a, b) => new Date(b.event.start_date).getTime() - new Date(a.event.start_date).getTime()
                );
                return of(true);
              })
            );
        })
      );
  }

  retrieveImage(eventId: string): Observable<SafeStyle> {
    return this.eventService.getEventImageById(eventId)
      .pipe(
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
}
