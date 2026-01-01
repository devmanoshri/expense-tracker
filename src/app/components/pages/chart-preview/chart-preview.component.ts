import { Component } from '@angular/core';
import { TransactionChartComponent } from '../../shared/transaction-chart/transaction-chart.component';
import { Transaction } from '../../../models/transaction.model';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';

@Component({
  selector: 'app-chart-preview',
  imports: [TransactionChartComponent, TransactionSummaryComponent],
  templateUrl: './chart-preview.component.html',
  styleUrl: './chart-preview.component.scss',
})
export class ChartPreviewComponent {
  transactionsChangeFromChart: Transaction[] = [];

  onTransactionsChange(transactions: Transaction[]) {
    this.transactionsChangeFromChart = transactions;
  }
}
