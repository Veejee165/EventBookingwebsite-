import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventService } from './event-service.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'api/bookings'; 

  constructor(private http: HttpClient, private eventService: EventService) {}

  // Get all bookings
  getAllBookings(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Create a booking
  createBooking(user: string, event: string, quantity: number): Observable<any> {
    const booking = { user, event, quantity }; // Create the booking object with required properties

    return new Observable((observer) => {
      this.http.post<any>(this.baseUrl, booking).subscribe(
        (response) => {
          // Lower the quantity of the event by the quantity of the booking
          this.eventService.updateEventQuantity(event, -quantity).subscribe(
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
    });
  }
  // Delete a booking
  deleteBooking(bookingId: string): Observable<any> {
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.delete<any>(url);
  }
  getUserBookings(userId: string): Observable<any> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get(url);
  }

  cancelBooking(bookingId: string): Observable<any> {
    const url = `${this.baseUrl}/${bookingId}`;
    return this.http.delete(url);
  }
  
 
}


