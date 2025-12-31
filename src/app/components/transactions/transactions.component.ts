import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { CategoriesService } from '../../services/categories.service';
import { TransactionService } from '../../services/transaction.service';

import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';

import { Observable, of } from 'rxjs';
import { TransactionChartComponent } from './transaction-chart/transaction-chart.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { TransactionStoreService } from '../../services/transaction-store.service';
import { FilterTransactionPipe } from '../../pipes/filter-transaction.pipe';
import { CategoryStoreService } from '../../services/category-store.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TransactionListComponent,
    TransactionFilterComponent,
    TransactionSummaryComponent,
    TransactionChartComponent,
    FilterTransactionPipe,
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
