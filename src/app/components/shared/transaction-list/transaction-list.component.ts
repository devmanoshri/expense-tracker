import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, delay, Observable, of, take, throttleTime } from 'rxjs';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';
import { SortTransactionPipe } from '../../../pipes/sort-transaction.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';
import { ModalComponent } from '../modal/modal.component';
import { TransactionAddEditComponent } from '../transaction-add-edit/transaction-add-edit.component';
import { MessageService } from '../message/message.service';

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
    ScrollingModule,
    SlicePipe,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() transactions: Transaction[] = [];
  @Input() showSorting = true;

  @ViewChild(CdkScrollable, { static: true }) scrollable!: CdkScrollable;

  private readonly changeDetection = inject(ChangeDetectorRef);
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

  private categoryStoreServices = inject(CategoryStoreService);
  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);
  isTransactionLoading$ = this.transactionStoreServices.transactionIsLoading$;
  isTransactionError$ = this.transactionStoreServices.transactionHasError$;
  isTransactionDeleting = false;
  hasTransactionDeleteError = false;

  constructor() {
    this.sortSelect = new FormControl(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.visibleTransactionCount = 10;
      this.totalTransactionCount = this.transactions?.length;
    }
  }

  ngOnInit(): void {
    this.sortTitle = this.showSorting
      ? 'Transaction List'
      : 'Latest Transactions';
    this.categoryStoreServices.initCategory();
    this.sortSelect.valueChanges.subscribe((value) => (this.sortBy = value));
    this.categories$ = this.categoryStoreServices.categories$;

    this.isTransactionError$.subscribe((errorMsg) => {
      if (errorMsg === true) {
        this.messageService.messsage$ = {
          text: 'Server error! No data found.',
          type: 'danger',
        };
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollable
      .elementScrolled()
      .pipe(throttleTime(200))
      .subscribe(() => {
        const element = this.scrollable.getElementRef().nativeElement;
        const atBottom =
          element.scrollHeight - element.scrollTop < element.clientHeight + 50;
        //console.log(atBottom);
        setTimeout(() => {
          if (atBottom && this.hasMore) {
            this.showMore();
            this.changeDetection.markForCheck();
          }
        });
      });
  }

  getCategoryName(id?: string): string {
    return this.categoryStoreServices.getCategoryNameById(id);
  }

  onDeleteConfirmation(): void {
    if(this.isTransactionDeleting){
      return;
    }
    this.isTransactionDeleting = true; 
    this.hasTransactionDeleteError = false;
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
        this.transactionStoreServices.initTransaction(true);
        this.showConfirmationModal = false;
        this.messageService.messsage$ = {
          text: 'Transaction deleted successfully',
          type: 'success',
        };
      });
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
    console.log(this.visibleTransactionCount);
  }

  get hasMore() {
    if (!this.transactions) return;
    return this.visibleTransactionCount < this.transactions.length;
  }
}
