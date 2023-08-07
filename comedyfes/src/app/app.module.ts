import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CardComponent } from './card/card.component';
import { SharedserviceService } from './sharedservice.service';
import { NgxStripeModule } from 'ngx-stripe';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventListComponent,
    EventDetailsComponent,
    UserProfileComponent,
    BookingFormComponent,
    LoginComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
    PasswordResetComponent,
    NavbarComponent,
    CardComponent,
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    NgxStripeModule.forRoot(
      'pk_test_51NauYiSBEU9mLt63mFKiwMQOIDxHaNZlGW4OnDQweEmOk4Hbry81dmN29feTHUOvv4PSc4YCFUJUYq09YjHoIgZL00h8Mj1bzl'
    ),
  ],
  providers: [DatePipe, SharedserviceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
