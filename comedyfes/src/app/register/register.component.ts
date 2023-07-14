import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
  // styleUrls: ['./register.css']
})

export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  constructor(private authService: AuthService,private router: Router) {}

  register() {
    if (this.username && this.password && this.email) {
      this.authService.register(this.username, this.password, this.email).subscribe(
        (response: any) => {
        
          this.authService.login(this.username, this.password).subscribe(
            (response: any) => {
              const user = { username: this.username };
              this.router.navigate(['/home']);
            },
            (error: any) => {
              
            }
            );

        },
        (error: any) => {
          // Handle registration error, such as displaying an error message
        }
      );
    }
  }
}
