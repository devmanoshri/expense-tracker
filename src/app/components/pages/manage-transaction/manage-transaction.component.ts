import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { FilterTransactionPipe } from '../../../pipes/filter-transaction.pipe';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionListComponent } from '../../shared/transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-manage-transaction',
  imports: [
    CommonModule,
    TransactionListComponent,
    FilterTransactionPipe,
    SortTransactionPipe,
    TransactionFilterComponent,
  ],
  templateUrl: './manage-transaction.component.html',
  styleUrl: './manage-transaction.component.scss',
})
export class ManageTransactionComponent implements OnInit {
  // private transactionStoreServices = inject(TransactionStoreService);
  private categoryStoreServices = inject(CategoryStoreService);
  private route = inject(ActivatedRoute);

  transactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  selectedTransactions: Transaction[] | undefined;
  transactionsChangeFromChart: Transaction[] = [];

  transactionType = '';
  selectedCategoryId = '';
  fromDate = '';
  toDate = '';

  ngOnInit(): void {
    this.categoryStoreServices.fetchCategory();
    this.categories$ = this.categoryStoreServices.categories$;
    //this.transactionStoreServices.fetchTransaction();
    //this.transactions$ = this.transactionStoreServices.transactions$;

    this.transactions$ = this.route.data.pipe(
      map((data) => data['transactions'] as Transaction[]),
    );
  }
}
