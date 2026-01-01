import { CommonModule, SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { FilterTransactionPipe } from '../../../pipes/filter-transaction.pipe';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionListComponent } from '../../shared/transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-manage-transaction',
  imports: [
    CommonModule,
    TransactionListComponent,
    FilterTransactionPipe,
    SlicePipe,
    SortTransactionPipe,
    TransactionFilterComponent,
  ],
  templateUrl: './manage-transaction.component.html',
  styleUrl: './manage-transaction.component.scss',
})
export class ManageTransactionComponent {
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
}
