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
import { HttpClientModule } from '@angular/common/http';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { DefaultComponent } from './default/default.component';
import { SlickCarouselModule } from 'ngx-slick-carousel'; // Import the ngx-slick-carousel module

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
    DefaultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    MatDialogModule,
    BrowserAnimationsModule,
    SlickCarouselModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
