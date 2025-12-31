import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';

import { Observable } from 'rxjs';
import { FilterTransactionPipe } from '../../pipes/filter-transaction.pipe';
import { SortTransactionPipe } from '../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../services/category-store.service';
import { TransactionStoreService } from '../../services/transaction-store.service';
import { TransactionChartComponent } from './transaction-chart/transaction-chart.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TransactionListComponent,
    TransactionSummaryComponent,
    TransactionChartComponent,
    FilterTransactionPipe,
    SlicePipe,
    SortTransactionPipe,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  selectedTransactions: Transaction[] | undefined;

  private transactionStoreServices = inject(TransactionStoreService);
  private categoryStoreServices = inject(CategoryStoreService);

  transactionType = '';
  selectedCategoryId = '';
  fromDate = '';
  toDate = '';

  ngOnInit(): void {
    this.categoryStoreServices.initCategory();
    this.categories$ = this.categoryStoreServices.categories$;
    this.transactionStoreServices.initTransaction();
    this.transactions$ = this.transactionStoreServices.transactions$;
    this.transactions$.subscribe(
      (transactions) => (this.selectedTransactions = transactions)
    );
  }
}
