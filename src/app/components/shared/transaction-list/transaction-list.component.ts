import { CommonModule, SlicePipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  delay,
  Observable,
  of,
  Subscription,
  take
} from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';
import { MessageService } from '../message/message.service';
import { ModalComponent } from '../modal/modal.component';
import { TransactionAddEditComponent } from '../transaction-add-edit/transaction-add-edit.component';

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
  imports: [
    CommonModule,
    SortTransactionPipe,
    ReactiveFormsModule,
    ModalComponent,
    TransactionAddEditComponent,
    SlicePipe,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() transactions: Transaction[] = [];
  @Input() showSorting = true;
  @Input() mainCategoryList: Category[] = [];

  private readonly messageService = inject(MessageService);

  sortTitle: string = '';
  showModal = false;
  showConfirmationModal = false;
  sortBy: SortBy | null = null;
  categories$!: Observable<Category[]>;
  selectedTransactionId = '';
  selectedTransaction = {} as Transaction;
  isEdit = false;
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
  visibleTransactionCount = 10;
  visibleTransactions: Transaction[] = [];
  totalTransactionCount = 0;

  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);
  isTransactionLoading$ = this.transactionStoreServices.transactionIsLoading$;
  isTransactionError$ = this.transactionStoreServices.transactionHasError$;
  isTransactionDeleting = false;
  hasTransactionDeleteError = false;

  private subscription = new Subscription();

  constructor() {
    this.sortSelect = new FormControl(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.totalTransactionCount = this.transactions?.length;
      this.visibleTransactionCount =
        this.totalTransactionCount > 10 ? 10 : this.totalTransactionCount;
    }
  }

  ngOnInit(): void {
    this.sortTitle = this.showSorting
      ? 'Transaction List'
      : 'Latest Transactions';

    this.subscription.add(
      this.sortSelect.valueChanges.subscribe((value) => (this.sortBy = value)),
    );

    this.subscription.add(
      this.isTransactionError$.subscribe((errorMsg) => {
        if (errorMsg === true) {
          this.messageService.messsage$ = {
            text: 'Server error! No data found.',
            type: 'danger',
          };
        }
      }),
    );
  }

  getCategoryName(catId: string): string {
    return (
      this.mainCategoryList.find((category) => category.id === catId)?.name ||
      'Unknown'
    );
  }

  onDeleteConfirmation(): void {
    if (this.isTransactionDeleting) {
      return;
    }
    this.isTransactionDeleting = true;
    this.hasTransactionDeleteError = false;

    this.subscription.add(
      this.transactionService
        .deleteTransaction(this.selectedTransactionId)
        .pipe(
          take(1),
          delay(3000),
          catchError(() => {
            this.hasTransactionDeleteError = true;
            this.messageService.messsage$ = {
              text: 'Transaction deletion error occurrd!',
              type: 'danger',
            };
            return of(null);
          }),
        )
        .subscribe(() => {
          this.isTransactionDeleting = false;
          if (this.hasTransactionDeleteError) {
            return;
          }
          this.transactionStoreServices.fetchTransaction(true);
          this.showConfirmationModal = false;
          this.messageService.messsage$ = {
            text: 'Transaction deleted successfully',
            type: 'success',
          };
        }),
    );
  }

  onDeleteClick(selectedTransactionId: string): void {
    this.selectedTransactionId = selectedTransactionId;
    this.showConfirmationModal = true;
  }

  onDeleteCancel(): void {
    this.selectedTransactionId = '';
    this.showConfirmationModal = false;
  }

  onModalClose(): void {
    this.showModal = false;
    this.selectedTransaction = {} as Transaction;
  }

  onAddOrEditClick(transaction = {} as Transaction, isEdit = false): void {
    this.selectedTransaction = transaction;
    this.isEdit = isEdit;
    this.showModal = true;
  }

  showMore(): void {
    this.visibleTransactionCount += 10;
    if (this.transactions.length < this.visibleTransactionCount + 10) {
      this.visibleTransactionCount = this.transactions.length;
    }
  }

  get hasMore() {
    if (!this.transactions) return;
    return this.visibleTransactionCount < this.transactions.length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
