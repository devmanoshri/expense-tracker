import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, take } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoriesService } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryStoreService {
  private _categories$ = new BehaviorSubject<Category[]>([]);
  private _categoryHasError$ = new BehaviorSubject<boolean>(false);
  private _categoryIsLoading$ = new BehaviorSubject<boolean>(false);

  private readonly categoryServices = inject(CategoriesService);

  fetchCategory(force = false): void {
    if (
      (this._categories$.getValue().length && !force) ||
      this._categoryIsLoading$.getValue()
    ) {
      return;
    }

    this._categoryIsLoading$.next(true);
    this._categoryHasError$.next(false);

    this.categoryServices
      .getCategories()
      .pipe(
        take(1),
        catchError(() => {
          this._categoryHasError$.next(true);
          return of([]);
        }),
      )
      .subscribe((categoryData) => {
        this._categoryIsLoading$.next(false);
        this._categories$.next(categoryData);
      });
  }

  getCategoryNameById(id?: string): string {
    if (!id) return '';
    return (
      this._categories$.getValue().find((category) => category.id === id)
        ?.name || ''
    );
  }

  get categories$(): Observable<Category[]> {
    return this._categories$.asObservable();
  }

  get categoryHasError$(): Observable<boolean> {
    return this._categoryHasError$.asObservable();
  }

  get categoryHasLoading$():Observable<boolean>{
    return this._categoryIsLoading$.asObservable();
  }
}
