import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CategoriesService } from '../../services/categories.service';
import { TransactionService } from '../../services/transaction.service';

import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';

import { Observable, of } from 'rxjs';
import { FilterTransactionPipe } from '../../pipes/filter-transaction.pipe';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionSummaryComponent } from './transaction-summary/transaction-summary.component';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    TransactionAddComponent,
    TransactionListComponent,
    TransactionFilterComponent,
    TransactionSummaryComponent,
    FilterTransactionPipe
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions$: Observable<Transaction[]> = of([]);
  categories: Category[] = [];

  selectedCategoryId: string | null = null;
  fromDate = '';
  toDate = '';

  editingTransaction: Transaction | null = null;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.transactions$ = this.transactionService.getTransactions();
    this.categoryService.getCategories().subscribe(c => this.categories = c);
  }

  loadTransactions() {
  }

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

  onDeleteTransaction(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this transaction?');
    if (!confirmDelete) return;
    this.transactionService.deleteTransaction(id)
      .subscribe(() => this.loadTransactions());
  }
}
