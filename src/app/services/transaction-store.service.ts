import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, Observable, of, take } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionStoreService {
  private _transactions$ = new BehaviorSubject<Transaction[]>([]);
  private _transactionHasError$ = new BehaviorSubject<boolean>(false);
  private _transactionIsLoading$ = new BehaviorSubject<boolean>(false);

  private readonly transationService = inject(TransactionService);

  fetchTransaction(force = false): void {
    if (
      (this._transactions$.getValue().length && !force) ||
      this._transactionIsLoading$.getValue()
    ) {
      return;
    }

    this._transactionIsLoading$.next(true);
    this._transactionHasError$.next(false);

    this.transationService
      .getTransactions()
      .pipe(
        take(1),
        delay(1000),
        catchError(() => {
          this._transactionHasError$.next(true);
          return of([]);
        }),
      )
      .subscribe((transactions) => {
        this._transactionIsLoading$.next(false);
        this._transactions$.next(transactions);
      });
  }

  get transactions$(): Observable<Transaction[]> {
    return this._transactions$.asObservable();
  }
  get transactionHasError$(): Observable<boolean> {
    return this._transactionHasError$.asObservable();
  }
  get transactionIsLoading$(): Observable<boolean> {
    return this._transactionIsLoading$.asObservable();
  }
}
