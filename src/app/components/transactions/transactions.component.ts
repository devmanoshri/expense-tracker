import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TransactionService } from '../../services/transaction.service';
import { CategoriesService } from '../../services/categories.service';

import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';
import { ExpenseChartComponent } from "../expense-chart/expense-chart.component";

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ExpenseChartComponent],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[] = [];
  categories: Category[] = [];

  selectedCategoryId: string | null = null;
  fromDate: string = '';
  toDate: string = '';

  editTransactionId: string | null = null;

  newTransaction: Transaction = {
    title: '',
    amount: 0,
    type: 'income',
    categoryId: undefined,
    date: ''
  };

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadCategories();
  }

  loadTransactions(): void {
    this.transactionService
      .getTransactions()
      .subscribe(data => this.transactions = data);
  }

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .subscribe(data => this.categories = data);
  }

  /* ================= FILTERING ================= */

  get filteredTransactions(): Transaction[] {
    return this.transactions.filter(t => {

      // category filter (expense only)
      if (
        this.selectedCategoryId &&
        t.type === 'expense' &&
        t.categoryId !== this.selectedCategoryId
      ) {
        return false;
      }

      const txDate = new Date(t.date).getTime();
      const from = this.fromDate ? new Date(this.fromDate).getTime() : null;
      const to = this.toDate ? new Date(this.toDate).getTime() : null;

      if (from && txDate < from) return false;
      if (to && txDate > to) return false;

      return true;
    });
  }

  /* ================= CRUD ================= */

  addTransaction(): void {
    this.transactionService.addTransaction(this.newTransaction)
      .subscribe(() => {
        this.loadTransactions();
        this.resetForm();
      });
  }

  editTransaction(transaction: Transaction): void {
    this.editTransactionId = transaction.id!;
    this.newTransaction = { ...transaction };
  }

  updateTransaction(): void {
    this.transactionService.updateTransaction(this.newTransaction)
      .subscribe(() => {
        this.loadTransactions();
        this.resetForm();
        this.editTransactionId = null;
      });
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id)
      .subscribe(() => this.loadTransactions());
  }

  cancelEdit(): void {
    this.resetForm();
    this.editTransactionId = null;
  }

  resetForm(): void {
    this.newTransaction = {
      title: '',
      amount: 0,
      type: 'income',
      categoryId: undefined,
      date: ''
    };
  }

  /* ================= HELPERS ================= */

  getCategoryName(categoryId?: string): string {
    return this.categories.find(c => c.id === categoryId)?.name || '';
  }

  /* ================= TOTALS ================= */

  get totalIncome(): number {
    return this.filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpense(): number {
    return this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.totalIncome - this.totalExpense;
  }
}
