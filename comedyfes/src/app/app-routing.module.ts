import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/:id', component: EventDetailsComponent },
    ],
  },
  { path: 'booking-form', component: BookingFormComponent },

  { path: 'profile', component: UserProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recovery-mail', component: PasswordRecoveryComponent },
  {
    path: 'reset-password/token=:token',
    component: PasswordResetComponent,
  },
  // Add additional routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
