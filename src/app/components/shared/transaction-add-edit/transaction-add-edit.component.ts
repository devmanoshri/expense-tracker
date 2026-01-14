import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, delay, Observable, of, Subscription } from 'rxjs';
import { Category } from '../../../models/category.model';
import {
  Transaction,
  TransactionType,
} from '../../../models/transaction.model';
import { FilterCategoryPipe } from '../../../pipes/filter-category.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';
import { MessageService } from '../message/message.service';

@Component({
  selector: 'app-transaction-add-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FilterCategoryPipe],
  templateUrl: './transaction-add-edit.component.html',
  styleUrls: ['./transaction-add-edit.component.scss'],
})
export class TransactionAddEditComponent implements OnInit, OnDestroy {
  @Input() transaction = {} as Transaction;
  @Input() isEdit = false;

  @Output() abort = new EventEmitter<void>();

  transactions$: Observable<Transaction[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  updatedTransaction: Transaction | undefined;

  private categoryStoreServices = inject(CategoryStoreService);
  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private subscription = new Subscription();

  isTransactionError$ = this.transactionStoreServices.transactionHasError$;

  isSaveLoading = false;
  hasSaveError = false;
  isSubmitted = false;

  transactionForm = this.formBuilder.nonNullable.group({
    transactionType: ['income' as TransactionType, Validators.required],
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    categoryId: ['', Validators.required],
    transactionDate: ['', Validators.required],
  });

  ngOnInit(): void {
    this.categoryStoreServices.initCategory();
    this.transactionStoreServices.fetchTransaction();

    this.transactions$ = this.transactionStoreServices.transactions$;
    this.categories$ = this.categoryStoreServices.categories$;

    if (this.isEdit) {
      if (Object.keys(this.transaction).length) {
        this.transactionForm
          .get('transactionType')
          ?.setValue(this.transaction.type);
        this.transactionForm.get('title')?.setValue(this.transaction.title);
        this.transactionForm
          .get('categoryId')
          ?.setValue(this.transaction.categoryId);
        this.transactionForm.get('amount')?.setValue(this.transaction.amount);
        this.transactionForm
          .get('transactionDate')
          ?.setValue(this.transaction.date);
      }
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isSaveLoading) {
      return;
    }
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }
    const formValue = this.transactionForm.value;
    
    console.log(this.isSubmitted);
    const data = Object.assign(this.transaction, {
      type: formValue.transactionType,
      title: formValue.title,
      amount: formValue.amount,
      categoryId: formValue.categoryId,
      date: formValue.transactionDate,
    });

    this.saveTransaction(data, this.isEdit);

    // this.isEdit ? this.updateTransaction(data) : this.addTransaction(data);
  }

  private saveTransaction(data: Transaction, isEdit: boolean): void {
    this.isSaveLoading = true;
    this.hasSaveError = false;

    this.subscription.add(
      this.transactionService
        .saveTransaction(data, isEdit ? 'update' : 'add')
        .pipe(
          delay(1000),
          catchError(() => {
            this.hasSaveError = true;
            this.messageService.messsage$ = {
              text: 'Transaction update error occurred!',
              type: 'danger',
            };
            return of({} as Transaction);
          }),
        )
        .subscribe(() => {
          this.isSaveLoading = false;
          if (this.hasSaveError) {
            return;
          }
          this.messageService.messsage$ = {
            text: 'Transaction updated successfully!',
            type: 'success',
          };
          this.transactionStoreServices.fetchTransaction(true);
          this.abort.emit();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
