import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;
  //private apiUrl = '/api/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.apiUrl}/${transaction.id}`,
      transaction,
    );
  }
}
