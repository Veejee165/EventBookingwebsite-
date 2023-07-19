import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth-service.service';
import { EmailService } from '../email-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {
  recoveryEmail: string = '';

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    public activeModal: NgbActiveModal,
    private router:Router
  ) {}

  onSubmit() {
    this.authService.getUserbyMail(this.recoveryEmail).subscribe(
      (response: any) => {
        // Handle successful retrieval of user by email
        const user = response;
        this.sendCredentialsByEmail(user);
      },
      (error: any) => {
        // Handle error in retrieving user by email
      }
    );
  }

  private sendCredentialsByEmail(user: any) {
    console.log(user)
    const { userId, username, email } = user;
    const subject = 'Your Password Recovery';
    const body = `Click on this link if you wish to reset password for Username: ${username}`;
  
    this.emailService.sendEmail(email, subject, body, userId).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
        // Handle successful email sending
      },
      (error: any) => {
        // Handle error in email sending
      }
    );
  }
  
}
