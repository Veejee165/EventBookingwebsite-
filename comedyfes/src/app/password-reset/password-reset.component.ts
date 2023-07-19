import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailService } from '../email-service.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  token: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private emailService: EmailService,
    private router: Router
  ) { }

  // ngOnInit(): void {
  //   this.route.queryParamMap.subscribe((params) => {
  //     this.token = params.get('token');
      
  //   });
  // }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      localStorage.setItem('token', this.token);
      // You can now use the token in your component logic
    });
  }

  resetPassword(): void {
    if (this.password === this.confirmPassword) {
      this.authService.resetPassword(this.password).subscribe(
        (response: any) => {
          this.router.navigate(['/login']);
        },
        (error: any) => {
          // Handle error in password reset
        }
      );
    } else {
      // Handle password mismatch error
    }
  }
}
