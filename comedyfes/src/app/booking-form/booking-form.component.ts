import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../event-service.service';
import { BookingService } from '../booking-service.service';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { CouponServiceService } from '../coupon-service.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  @Input() event: any;
  @Input() user: any;
  @Output() closePopup = new EventEmitter<boolean>();

  booking: any = {
    quantity: 0,
    couponCode: ''
  };
  totalPrice: number = 0;
  showTick: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BookingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private couponService: CouponServiceService
  ) {}

  ngOnInit() {
    this.event = this.data.event;
    this.user = this.data.user;
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

  submitBookingForm() {
    const { user, event, quantity } = this.booking;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookingService.createBooking(user, event, quantity).subscribe(
      (response) => {
        console.log('Booking created:', response);
        this.showTick = true;
        setTimeout(() => {
          this.showTick = false;
          this.dialogRef.close();
          this.router.navigate(['/profile']); // Replace '/profile' with the desired profile page route
        }, 3000);
      },
      (error) => {
        console.error('Failed to create booking:', error);
      }
    );
  }
}
