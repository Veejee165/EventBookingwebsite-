import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = '/prac/events'; 
  constructor(private http: HttpClient) {}

  // Get all events
  getAllEvents(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getUpcomingEvents(): Observable<any[]> {
    return this.getAllEvents().pipe(
      map((events: any[]) => {
        const currentDate = new Date();
        return events.filter(event => new Date(event.end_date) >= currentDate);
      })
    );
  }

  // Get event by ID
  getEventById(eventId: string): Observable<any> {
    const url = `${this.baseUrl}/${eventId}`;
    return this.http.get<any>(url);
  }

  // Update event quantity
  updateEventQuantity(eventId: string, quantity: number): Observable<any> {
    const url = `${this.baseUrl}/${eventId}/quantity`;
    const payload = { quantity: quantity };
    return this.http.patch<any>(url, payload);
  }
}
