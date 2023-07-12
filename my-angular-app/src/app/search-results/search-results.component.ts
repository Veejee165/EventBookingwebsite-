import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Book} from '../models/book.model'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  books: Book[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchBooks();
  }
  
   
   fetchBooks() {
  
      this.http.get<any>('/api/prac/getb').subscribe
      (
        (response) => {
          
          this.books = response.books;
          
        },
        (error) => {
          console.error('Error fetching books:', error);
        }
      );
  }
}
