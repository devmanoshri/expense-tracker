import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/transactionCategories`;
  private categories: Category[] = [];

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  loadCategories() {
    this.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  // getCategoryName(catId: string): string {
  //   const category = this.categories.find(category => category.id === catId);
  //   return category ? category.name : 'Unknown';
  // }
}
