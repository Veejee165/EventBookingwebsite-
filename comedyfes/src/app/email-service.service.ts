import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailApiUrl = 'http://localhost:5001/prac/email'; // Replace with your email API endpoint

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, body: string, userId:any): Observable<any> {
    const emailData = {
      to,
      subject,
      body
    };

    return this.http.post(this.emailApiUrl, emailData,userId);
  }
  sendOrderEmail(to: string, subject: string, body: string): Observable<any> {
    const emailData = {
      to,
      subject,
      body
    };

    return this.http.post(`${this.emailApiUrl}/order`, emailData);
  }
}
