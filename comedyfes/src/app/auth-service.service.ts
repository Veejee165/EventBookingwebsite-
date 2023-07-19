import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/prac'; 
  private currentUser: any;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `${token}`);
    const options = { headers: headers };
    return this.http.get(`${this.apiUrl}/current-user`, options);
  }
  

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    const body = { username, password };
    return this.http.post(url, body);
  }

  register(username: string, password: string, email: string): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;
    const body = { username, password, email };
    return this.http.post(url, body);
  }
  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put(url, userData);
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url);
  }

  getUser() {
    return this.currentUser;
  }
  getUsername(){
    return this.currentUser.username
  }
}
