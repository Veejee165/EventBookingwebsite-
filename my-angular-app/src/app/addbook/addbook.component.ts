import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface FormData {
  title: string;
  author: string;
  collegeId: string;
  course: string;
  year: number;
  number: number;
}

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddBookComponent {
  constructor(private http: HttpClient) {}

  submitForm(event: Event) {
    event.preventDefault(); // Prevent form submission

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data: FormData = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      collegeId: formData.get('collegeId') as string,
      course: formData.get('course') as string,
      year: Number(formData.get('year')),
      number: Number(formData.get('number'))
    };

    this.http.post('/prac/add_book', data)
      .subscribe(
        () => {
          window.location.href = '/prac/'; // Redirect to home page on success
        },
        (error) => {
          console.error('Error submitting form:', error);
          alert('An error occurred. Please try again later.');
        }
      );
  }
}
