import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event-service.service';
import { AuthService } from '../auth-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchEventName: string = '';
  searchLocation: string = '';
  upcomingEvents: any[] = [];
  filteredEvents: any[] = [];
  loggedIn: boolean = false;
  username: string = '';

  constructor(private router: Router, private eventService: EventService, private authservice:AuthService) {}

  ngOnInit() {
    this.getUpcomingEvents();
    this.checkLoginStatus();
  }

  getUpcomingEvents() {
    this.eventService.getUpcomingEvents().subscribe(
      (events: any[]) => {
        this.upcomingEvents = events;
        this.filteredEvents = this.upcomingEvents;
      },
      (error: any) => {
        console.error('Error fetching upcoming events:', error);
      }
    );
  }

  searchEvents() {
    this.filteredEvents = this.upcomingEvents.filter(event =>
      event.title.toLowerCase().includes(this.searchEventName.toLowerCase()) &&
      (event.city.toLowerCase().includes(this.searchLocation.toLowerCase()) ||
        event.state.toLowerCase().includes(this.searchLocation.toLowerCase()) ||
        event.country.toLowerCase().includes(this.searchLocation.toLowerCase()))
    );
  }

  goToEventDetails(eventId: string) {
    this.router.navigate(['/event-details', eventId]);
  }
  checkLoginStatus() {
    // Use the AuthService to check the login status
    this.loggedIn = this.authservice.isLoggedIn()?this.username = this.authservice.getUsername():this.loggedIn=false;
  }

  goToUserProfile() {
    // Assuming the user profile route is '/user-profile', navigate to it
    this.router.navigate(['/profile']);
  }
}
