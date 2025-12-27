import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionService } from '../../services/transaction.service';
import { CategoriesService } from '../../services/categories.service';

import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';
import { TransactionChartComponent } from "./transaction-chart/transaction-chart.component";


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TransactionAddComponent,
    TransactionListComponent,
    TransactionFilterComponent,
    TransactionSummaryComponent,
    TransactionChartComponent
],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];
  categories: Category[] = [];

  selectedCategoryId: string | null = null;
  fromDate = '';
  toDate = '';

  editingTransaction: Transaction | null = null;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.categoryService.getCategories().subscribe(c => this.categories = c);
  }

  loadTransactions() {
    this.transactionService.getTransactions()
      .subscribe(t => this.transactions = t);
  }

  /* ===== FILTERED DATA ===== */
  get filteredTransactions(): Transaction[] {
    return this.transactions.filter(t => {
      if (
        this.selectedCategoryId &&
        t.type === 'expense' &&
        t.categoryId !== this.selectedCategoryId
      ) return false;

      const tx = new Date(t.date).getTime();
      const from = this.fromDate ? new Date(this.fromDate).getTime() : null;
      const to = this.toDate ? new Date(this.toDate).getTime() : null;

      if (from && tx < from) return false;
      if (to && tx > to) return false;

      return true;
    });
  }

  /* ===== CRUD ===== */
  saveTransaction(tx: Transaction) {
    const req = tx.id
      ? this.transactionService.updateTransaction(tx)
      : this.transactionService.addTransaction(tx);

    req.subscribe(() => {
      this.editingTransaction = null;
      this.loadTransactions();
    });
  }

  edit(tx: Transaction) {
    this.editingTransaction = tx;
  }

  delete(id: string) {
    this.transactionService.deleteTransaction(id)
      .subscribe(() => this.loadTransactions());
  }
}
