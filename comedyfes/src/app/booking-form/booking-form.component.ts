import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { BookingService } from '../booking-service.service';
import { Router } from '@angular/router';
import { CouponServiceService } from '../coupon-service.service';
import { EmailService } from '../email-service.service';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { SharedserviceService } from '../sharedservice.service';
import { response } from 'express';
import { error } from 'jquery';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit, AfterViewInit {
  booking: any = {
    quantity: 0,
    couponCode: '',
  };

  userAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
  } = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  };

  totalPrice: number = 0;
  showTick: boolean = false;
  couponId: any;
  event: any;
  user: any;

  @ViewChild('cardElement') cardElement!: ElementRef;

  stripe!: Stripe | null;
  elements!: StripeElements;
  card!: StripeCardElement;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private couponService: CouponServiceService,
    private emailService: EmailService,
    private sharedDataService: SharedserviceService
  ) {}

  async ngAfterViewInit() {
    this.stripe = await loadStripe(
      'pk_test_51NauYiSBEU9mLt63mFKiwMQOIDxHaNZlGW4OnDQweEmOk4Hbry81dmN29feTHUOvv4PSc4YCFUJUYq09YjHoIgZL00h8Mj1bzl'
    );
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount(this.cardElement.nativeElement);
    }
  }

  ngOnInit() {
    this.event = this.sharedDataService.getEvent();
    this.user = this.sharedDataService.getUser();
    this.calculateTotalPrice();
    console.log(this.event);
    console.log(this.user);
  }

  updateQuantity() {
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const quantity = this.booking.quantity;
    const price = this.event.ticket_price;
    const discount = this.event.discount || 0;
    this.totalPrice = quantity * price - (quantity * price * discount) / 100;
    console.log(this.totalPrice);
  }

  applyCoupon(couponInput: HTMLInputElement) {
    if (!this.booking.couponCode) {
      return;
    }

    this.couponService.checkCouponValidity(this.booking.couponCode).subscribe(
      (response: any) => {
        if (response.valid) {
          this.couponId = response.id;
          this.event.discount = response.discount;
          this.calculateTotalPrice();
        } else {
          window.confirm('Invalid coupon code. Please try again.');
          this.booking.couponCode = '';
          couponInput.value = '';
        }
      },
      (error: any) => {
        console.error('Failed to check coupon validity:', error);
        alert('Invalid coupon code. Please try again.');
        this.booking.couponCode = '';
        couponInput.value = '';
      }
    );
  }

  sendOrderByEmail(bookingId: string) {
    const email = this.user.email;
    const subject = 'Order Confirmation';
    const body = `
      <p>Your Booking has been confirmed for the event ${this.event.title}</p>
      <p>Booking ID: ${bookingId}</p>
      <p>Date: ${this.event.date}</p>
      <p>Location: ${this.event.location}</p>
      <p>Total Price: ${this.totalPrice}</p>
    `;
    this.emailService.sendOrderEmail(email, subject, body).subscribe(
      (response: any) => {},
      (error: any) => {}
    );
  }

  async onSubmitPayment() {
    if (!this.elements || !this.card) {
      console.error('Stripe Elements not initialized.');
      return;
    }

    if (this.stripe) {
      try {
        // Create the Payment Method
        const paymentMethodResult = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.card,
          billing_details: {
            name: this.user.username,
            address: {
              line1: this.userAddress.line1,
              line2: this.userAddress.line2,
              city: this.userAddress.city,
              state: this.userAddress.state,
              country: 'IN',
              postal_code: this.userAddress.postalCode,
            },
            email: this.user.email,
          },
        });

        if (paymentMethodResult.error) {
          console.error(
            'Payment method creation error:',
            paymentMethodResult.error
          );
          return;
        }

        // Create the Payment Intent
        const paymentIntentResponse = await this.bookingService
          .createPaymentIntent({
            amount: this.totalPrice * 100, // Convert to paisa
            currency: 'INR',
            description: `${this.event.title}, Quantity: ${this.booking.quantity}`,
            customerName: this.user.username,
            customerAddress: this.userAddress,
            customerEmail: this.user.email,
            paymentMethodId: paymentMethodResult.paymentMethod?.id,
          })
          .toPromise();

        if (paymentIntentResponse.clientSecret) {
          // Confirm the Payment Intent
          const { paymentIntent, error } = await this.stripe.confirmCardPayment(
            paymentIntentResponse.clientSecret
          );

          if (error) {
            console.error('Payment confirmation error:', error);
          } else if (paymentIntent?.status === 'succeeded') {
            console.log(
              'Payment confirmed with Payment Intent:',
              paymentIntent.id
            );
            // Proceed with booking form submission
            this.submitBookingForm(paymentIntent.id);
          }
        }
      } catch (error) {
        console.error('Payment process error:', error);
      }
    }
  }

  async submitBookingForm(paymentIntentId: string) {
    try {
      const user = this.user;
      const event = this.event;
      const quantity = this.booking.quantity;
      const paid = this.totalPrice;

      const amountInCents = paid * 100;
      const description = `${event.title}, Quantity: ${quantity}`;

      const paymentData = {
        amount: amountInCents,
        currency: 'USD',
        paymentIntentId: paymentIntentId, // Use the Payment Intent ID for payment processing
        description,
      };

      const bookingResponse = await this.bookingService
        .createBooking(user, event, quantity, paid, paymentIntentId)
        .toPromise();

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
      console.log('Booking created:', bookingResponse);
      this.showTick = true;
      setTimeout(() => {
        this.showTick = false;
        this.router.navigate(['/profile']); // Replace '/profile' with the desired profile page route
      }, 4000);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
    }
  }
}
