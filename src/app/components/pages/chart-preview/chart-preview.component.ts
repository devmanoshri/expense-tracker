import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionChartComponent } from '../../shared/transaction-chart/transaction-chart.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';

@Component({
  selector: 'app-chart-preview',
  imports: [TransactionChartComponent, TransactionSummaryComponent, AsyncPipe],
  templateUrl: './chart-preview.component.html',
  styleUrl: './chart-preview.component.scss',
})
export class ChartPreviewComponent implements OnInit {
  transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;

  private transactionStoreService = inject(TransactionStoreService);
  private categoryStoreService = inject(CategoryStoreService);

  transactionsChangeFromChart: Transaction[] = [];

  ngOnInit(): void {
    this.categoryStoreService.fetchCategory();
    this.transactionStoreService.fetchTransaction();

    this.categories$ = this.categoryStoreService.categories$;
    this.transactions$ = this.transactionStoreService.transactions$;
  }

  onTransactionsChange(transactions: Transaction[]) {
    setTimeout(() => (this.transactionsChangeFromChart = transactions), 1000);
  }
}
