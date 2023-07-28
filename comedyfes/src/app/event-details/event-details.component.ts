import { Component, OnInit,Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal and NgbModalRef
import { EventService } from '../event-service.service';
import { AuthService } from '../auth-service.service';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Import DomSanitizer

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
@Injectable({
  providedIn: 'root',
})
export class EventDetailsComponent implements OnInit {
  event: any;
  user: any;
  modalRef!: NgbModalRef; // Add the ! modifier to mark it as definitely assigned
  showBookingForm: boolean = false; // 
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer // Inject the NgbModal service
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.eventService.getEventById(eventId).subscribe(event => {
        this.event = event;
        this.retrieveImage(event);
      });
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  openBookingDialog() {
    this.showBookingForm = true;
  }
  // openBookingDialog() {
  //   console.log("open")
  //   // Open the modal and set the component properties
  //   const modalRef = this.modalService.open(BookingFormComponent, { centered: true });
  //   modalRef.componentInstance.event = this.event; // Pass the event data to the modal
  //   modalRef.componentInstance.user = this.user; // Pass the user data to the modal
  //   // Subscribe to the closePopup event emitted by the BookingFormComponent
  //   modalRef.componentInstance.closePopup.subscribe((closed: boolean) => {
  //     if (closed) {
  //       console.log("closed")
  //       modalRef.close(); // Close the modal when closePopup is emitted
  //     }
  //   });
  // }
  retrieveImage(event: any) {
    this.eventService.getEventImageById(event._id).subscribe(
      (imageBlob: Blob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        event.image = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      },
      (error: any) => {
        console.error('Failed to retrieve event image:', error);
      }
    );
  }
}
