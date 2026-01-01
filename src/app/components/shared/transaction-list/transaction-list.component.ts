import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';

interface SelectSort {
  label: string;
  value: SortBy;
}
interface SortBy {
  orderBy: keyof Transaction;
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SortTransactionPipe, ReactiveFormsModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] | undefined;
  @Input() showSorting = true;
  sortTitle: string = '';

  sortBy: SortBy | null = null;
  categories$!: Observable<Category[]>;

  sortSelect: FormControl<SortBy | null>;
  selectSortObject: SelectSort[] = [
    {
      label: 'Newest',
      value: { orderBy: 'date', sortOrder: 'desc' },
    },
    {
      label: 'Oldest',
      value: { orderBy: 'date', sortOrder: 'asc' },
    },
    {
      label: 'Amount (high to low)',
      value: { orderBy: 'amount', sortOrder: 'desc' },
    },
    {
      label: 'Amount (low to high)',
      value: { orderBy: 'amount', sortOrder: 'asc' },
    },
  ];

  private categoryStoreServices = inject(CategoryStoreService);
  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);

  constructor() {
    this.sortSelect = new FormControl(null);
  }

  ngOnInit(): void {
    this.sortTitle = this.showSorting
      ? 'Transaction List'
      : 'Latest Transactions';
    this.categoryStoreServices.initCategory();
    this.sortSelect.valueChanges.subscribe((value) => (this.sortBy = value));
    this.categories$ = this.categoryStoreServices.categories$;
  }

  getCategoryName(id?: string): string {
    return this.categoryStoreServices.getCategoryNameById(id);
  }

  onDelete(selectedTransactionId: string): void {
    const confirmDelete = confirm(
      'Are you sure you want to delete this transaction?',
    );
    if (!confirmDelete) return;

    this.transactionService
      .deleteTransaction(selectedTransactionId)
      .subscribe(() => this.transactionStoreServices.initTransaction(true));
  }
}
