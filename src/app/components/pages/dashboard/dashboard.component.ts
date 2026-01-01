import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { FilterTransactionPipe } from '../../../pipes/filter-transaction.pipe';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionChartComponent } from '../../shared/transaction-chart/transaction-chart.component';
import { TransactionListComponent } from '../../shared/transaction-list/transaction-list.component';
import { TransactionSummaryComponent } from '../chart-preview/transaction-summary/transaction-summary.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    TransactionListComponent,
    TransactionSummaryComponent,
    TransactionChartComponent,
    FilterTransactionPipe,
    SlicePipe,
    SortTransactionPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  selectedTransactions: Transaction[] | undefined;
  transactionsChangeFromChart: Transaction[] = [];

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
      (transactions) => (this.selectedTransactions = transactions),
    );
  }

  onTransactionsChange(transactions: Transaction[]) {
    this.transactionsChangeFromChart = transactions;
  }
}
