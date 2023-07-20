import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event-service.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { AuthService } from '../auth-service.service';
import {MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId!: string;
  event: any;
  user: any;
  isBookingFormOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.getEventDetails();

    // Subscribe to get the user object
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Failed to get current user:', error);
      }
    );
  }

  getEventDetails() {
    this.eventService.getEventById(this.eventId).subscribe(
      (event) => {
        this.event = event;
      },
      (error) => {
        console.error('Failed to fetch event details:', error);
      }
    );
  }

  openBookingDialog(): void {
    this.isBookingFormOpen = true; // Open the booking form
    const dialogRef = this.dialog.open(BookingFormComponent, {
      width: '500px', // Adjust the width as needed
      panelClass: 'booking-dialog',
      data: {
        event: this.event,
        user: this.user
      }
    });

    // Subscribe to the afterClosed event to handle the dialog close action
    dialogRef.afterClosed().subscribe((result) => {
      this.isBookingFormOpen = false; // Set the flag to close the dialog
    });
  }
}
