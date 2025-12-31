import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit, OnChanges {
  //transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  @Input() transactions: Transaction[] | undefined;
  sortOrder: 'asc' | 'desc' = 'desc';
  sortedTransactions: Transaction[] = [];

  private categoryStoreServices = inject(CategoryStoreService);
  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);

  ngOnInit(): void {
    this.categoryStoreServices.initCategory();
    // this.transactionStoreServices.initTransaction();

    //this.transactions$ = this.transactionStoreServices.transactions$;
    this.categories$ = this.categoryStoreServices.categories$;
    this.applySorting();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.applySorting();
    }
  }

  getCategoryName(id?: string): string {
    return this.categoryStoreServices.getCategoryNameById(id);
  }

  onDelete(selectedTransactionId: string): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this transaction?'
    );
    if (!confirmDelete) return;

    this.transactionService
      .deleteTransaction(selectedTransactionId)
      .subscribe(() => this.transactionStoreServices.initTransaction(true));
  }

  onSelectSorting(event: Event) {
    this.sortOrder = (event.target as HTMLSelectElement).value as
      | 'asc'
      | 'desc';
    this.applySorting();
  }

  applySorting() {
    if (!this.transactions) return;
    this.sortedTransactions = [...this.transactions].sort((a, b) =>
      this.sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
}
