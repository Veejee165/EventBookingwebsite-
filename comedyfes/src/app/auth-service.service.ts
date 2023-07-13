import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; 
  private currentUser: any;

  constructor(private http: HttpClient) {}

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
  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  // Get the current user
  getCurrentUser() {
    return this.currentUser;
  }
  isLoggedIn(){
    if(this.currentUser)
      return true;
    return false;
  }
  getUsername(){
    return this.currentUser.username;
  }
}
