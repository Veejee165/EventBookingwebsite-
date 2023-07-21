import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { CouponServiceService } from '../coupon-service.service';
import { EmailService } from '../email-service.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  @Input() event: any;
  @Input() user: any;
  public modalRef!: NgbModalRef;
  @Output() closePopup = new EventEmitter<boolean>();

  booking: any = {
    quantity: 0,
    couponCode: ''
  };
  totalPrice: number = 0;
  showTick: boolean = false;
  couponId: any;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private couponService: CouponServiceService,
    private emailService :EmailService
  ) {}

  ngOnInit() {
    this.calculateTotalPrice();
  }

  updateQuantity() {
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const quantity = this.booking.quantity;
    const price = this.event.ticket_price;
    const discount = this.event.discount || 0; // Assuming the discount is provided in the event data

    // Calculate the total price after applying the discount
    this.totalPrice = quantity * price - (quantity * price * discount) / 100;
  }

  applyCoupon() {
    if (!this.booking.couponCode) {
      return;
    }

    // Call the CouponService to check the coupon validity and get the discount amount
    // Assuming the CouponService method is named `checkCouponValidity()`
    this.couponService.checkCouponValidity(this.booking.couponCode).subscribe(
      (response: any) => {
        if (response.valid) {
          // Apply the discount to the booking
          this.couponId = response._id;
          this.event.discount = response.discount;
          this.calculateTotalPrice();
        } else {
          // Handle invalid coupon code
          // Show an error message or take appropriate action
        }
      },
      (error: any) => {
        console.error('Failed to check coupon validity:', error);
        // Handle error
      }
    );
  }
  sendOrderByEmail(bookingId: string) {
    const email = this.user.email
    const subject = 'Order Confirmation';
    const body = `Your Booking has been confirmed for the event ${this.event.title}`;
  
    this.emailService.sendEmail(email, subject, body, bookingId).subscribe(
      (response: any) => {
      },
      (error: any) => {
      }
    );
  }

  submitBookingForm() {
    const { user, event, quantity } = this.booking;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookingService.createBooking(user, event, quantity).subscribe(
      (response) => {
        this.couponService.updateUserCount(this.couponId).subscribe(
          (response) => {
            console.log('User count updated successfully:', response);
            // Optionally, you can perform other actions after updating the user count
          },
          (error) => {
            console.error('Failed to update user count:', error);
            // Handle the error if needed
          }
        );
        this.sendOrderByEmail(this.booking._id);
        console.log('Booking created:', response);
        this.showTick = true;
        setTimeout(() => {
          this.showTick = false;
          this.closePopup.emit(true); // Emit the event to close the popup
          this.router.navigate(['/profile']); // Replace '/profile' with the desired profile page route
        }, 3000);
      },
      (error) => {
        console.error('Failed to create booking:', error);
      }
    );
  }
}
