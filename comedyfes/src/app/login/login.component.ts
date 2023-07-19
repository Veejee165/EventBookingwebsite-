import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  // styleUrls: ['./login.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService,private router: Router) {}

  login() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token); 
          this.router.navigate(['/']);
          
        },
        (error: any) => {
          // Handle login error, such as displaying an error message
        }
      );
    }
  }
}
