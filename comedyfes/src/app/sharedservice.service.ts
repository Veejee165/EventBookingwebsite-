import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedserviceService {
  private eventData: any;
  private userData: any;

  setEvent(event: any) {
    this.eventData = event;
  }

  getEvent(): any {
    return this.eventData;
  }

  setUser(user: any) {
    this.userData = user;
  }

  getUser(): any {
    return this.userData;
  }
}
