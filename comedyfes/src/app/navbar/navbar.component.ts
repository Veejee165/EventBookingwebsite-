import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  loggedIn: boolean = false;
  username: string = '';
  ngOnInit() {
    this.checkLoginStatus();
  }
  constructor(  private router: Router,private authService:AuthService){}

  checkLoginStatus() {
    this.authService.getCurrentUser().subscribe(
      (response: any) => {
        this.username = response.username;
        this.loggedIn = true;
      },
      (error: any) => {}
    );
  }

  goToUserProfile() {
    this.router.navigate(['/profile']);
  } 
}
