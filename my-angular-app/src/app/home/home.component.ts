import { Component } from '@angular/core';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  academicYear: number = 0;
  bookTitle: string = '';

  constructor() {}

  ngOnInit(): void {}

  searchBooks(): void {
    window.location.href = '/search-results'
  }
}

