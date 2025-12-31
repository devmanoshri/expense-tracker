import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { TransactionStoreService } from '../../../services/transaction-store.service';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})

export class TransactionSummaryComponent {

  @Input() selectedTransactions: Transaction[] | undefined;

  //transactions$: Observable<Transaction[]> = of([]);
  //selectedTransactions: Transaction[] | undefined;

  // private transactionStoreServices = inject(TransactionStoreService);


  // ngOnInit(): void {
  //   this.transactionStoreServices.initTransaction();
  //   this.transactions$ = this.transactionStoreServices.transactions$;
  //   this.transactions$.subscribe((transactions) => this.selectedTransactions = transactions);
  // }

  get totalIncome(): number | undefined {
    if (!this.selectedTransactions) return;
    return this.selectedTransactions.filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

  };

  get totalExpense(): number | undefined {
    if (!this.selectedTransactions) return;
    return this.selectedTransactions.filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  get balance(): number | undefined {
    if (!this.totalIncome || !this.totalExpense) return;
    return this.totalIncome - this.totalExpense;
  }

}
