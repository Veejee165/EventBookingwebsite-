import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal and NgbModalRef
import { EventService } from '../event-service.service';
import { AuthService } from '../auth-service.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { Observable } from 'rxjs';
import { SharedserviceService } from '../sharedservice.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class EventDetailsComponent implements OnInit {
  event: any;
  user: any;
  modalRef!: NgbModalRef;
  showBookingForm: boolean = false;
  similarEvents: any[];
  events: any[];
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private sharedDataService: SharedserviceService,
    private sanitizer: DomSanitizer // Inject the NgbModal service
  ) {
    this.similarEvents = [];
    this.events = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const eventId = params['id'];
      this.eventService.getEventById(eventId).subscribe((event) => {
        this.event = event;
        this.retrieveImage(event);
        this.getSimilarEvents();
      });
    });
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  //   openBookingDialog() {
  //     this.router.navigate(['booking-form', this.event, this.user]);
  //   }
  openBookingDialog() {
    if (this.event && this.user) {
      this.sharedDataService.setEvent(this.event);
      this.sharedDataService.setUser(this.user);
      this.router.navigate(['/booking-form']);
    }
  }
  getSimilarEvents() {
    this.eventService.getUpcomingEvents().subscribe(
      (events) => {
        this.events = events.filter(
          (event) =>
            event.ticket_quantity > 0 &&
            event.category == this.event.category &&
            event._id !== this.event._id
        );
        console.log(this.events);
        this.events.forEach((event) => {
          console.log(event);
          this.retrieveImage(event);
        });
      },
      (error) => {
        console.error('Failed to fetch upcoming events:', error);
      }
    );
  }
  goToEventDetails(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }
  retrieveImage(event: any) {
    this.eventService.getEventImageById(event._id).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);

        if (this.event !== event) {
          event.image = this.sanitizer.bypassSecurityTrustStyle(
            `url(${imageUrl})`
          );
          this.similarEvents.push(event);
        } else {
          event.image = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        }
      },
      (error: any) => {
        console.error('Failed to retrieve event image:', error);
      }
    );
  }
}
