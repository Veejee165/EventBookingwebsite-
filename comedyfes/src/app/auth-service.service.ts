import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/prac'; 
  private currentUser: any;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/current-user`);
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
 
  setUser(user: any) {
    this.currentUser = user;
  }

  getUser() {
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
