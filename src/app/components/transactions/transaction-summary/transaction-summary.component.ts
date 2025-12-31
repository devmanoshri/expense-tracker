import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss'],
})
export class TransactionSummaryComponent {
  @Input() selectedTransactions: Transaction[] | undefined;

  get totalIncome(): number | undefined {
    if (!this.selectedTransactions) return;
    return this.selectedTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  get totalExpense(): number | undefined {
    if (!this.selectedTransactions) return;
    return this.selectedTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  get balance(): number | undefined {
    if (!this.totalIncome || !this.totalExpense) return;
    return this.totalIncome - this.totalExpense;
  }
}
