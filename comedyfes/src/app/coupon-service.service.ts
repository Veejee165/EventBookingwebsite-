import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponServiceService {
  private apiUrl = 'http://localhost:5001/prac/coupons'; // Replace this with your actual API URL

  constructor(private http: HttpClient) { }

  getAllCoupons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  createCoupon(couponData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, couponData);
  }

  deleteCoupon(couponId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${couponId}`);
  }

  checkCouponValidity(couponCode: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkValidity`, { couponCode });
  }

}
