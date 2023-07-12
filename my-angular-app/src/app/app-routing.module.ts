import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HomeComponent } from './home/home.component';
import { AddBookComponent } from './addbook/addbook.component';

const routes: Routes = [
  { path: 'search-results', component: SearchResultsComponent },
  { path: '', component: HomeComponent },
  { path: 'add-book', component: AddBookComponent },
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
