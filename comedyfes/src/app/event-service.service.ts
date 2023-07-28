import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:5001/prac/events';

  constructor(private http: HttpClient) { }

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

  getEventsbyCategory(category: string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/cat/${category}`)
  }
  // Get event by ID
  getEventById(eventId: string): Observable<any> {
    const url = `${this.baseUrl}/${eventId}`;
    return this.http.get<any>(url);
  }

  // Update event quantity
  updateEventQuantity(eventId: string, quantity: number): Observable<any> {
    const url = `${this.baseUrl}/${eventId}`;
    const payload = { ticket_quantity: -quantity };
    return this.http.put<any>(url, payload);
  }
  getEventImageById(eventId: string): Observable<Blob> {
    const url = `${this.baseUrl}/image/${eventId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'image/jpeg' });
    return this.http.get(url, { headers , responseType: 'blob' });
  }

}
