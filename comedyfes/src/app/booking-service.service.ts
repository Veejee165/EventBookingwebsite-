import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventService } from './event-service.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:5001/prac/bookings';

  constructor(private http: HttpClient, private eventService: EventService) {}

  // Get all bookings
  getAllBookings(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Create a booking
  createBooking(
    user: any,
    event: any,
    quantity: number,
    paid: number,
    paymentIntentId: String
  ): Observable<any> {
    const booking = {
      user: user._id,
      event: event._id,
      quantity,
      paid,
      paymentIntentId,
    }; // Create the booking object with required properties
    return new Observable((observer) => {
      if (quantity <= event.ticket_quantity) {
        this.http.post<any>(this.baseUrl, booking).subscribe(
          (response) => {
            // Lower the quantity of the event by the quantity of the booking
            this.eventService
              .updateEventQuantity(event._id, quantity)
              .subscribe(
                () => {
                  observer.next(response);
                  observer.complete();
                },
                (error) => {
                  observer.error(error);
                }
              );
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Not enough seats left');
      }
    });
  }

  // Delete a booking
  deleteBooking(booking: any): Observable<any> {
    const bookingId = booking._id;
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.delete<any>(url);
  }

  getUserBookings(userId: string): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get(url);
  }

  // Update the createPaymentIntent method to create a charge instead
  createPaymentIntent(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-payment`, paymentData);
  }
  initiateRefund(paymentIntentId: string): Observable<any> {
    const url = `${this.baseUrl}/refund/${paymentIntentId}`;
    return this.http.post(url, {});
  }

  updateBookingWithPaymentIntentId(
    booking: any,
    paymentIntentId: string
  ): Observable<any> {
    const url = `${this.baseUrl}/intent/${booking._id}`;
    const updates = { paymentIntentId };
    return this.http.patch(url, updates);
  }
}
