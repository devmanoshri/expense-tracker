import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Category } from '../../../models/category.model';
import {
  Transaction,
  TransactionType,
} from '../../../models/transaction.model';
import { FilterCategoryPipe } from '../../../pipes/filter-category.pipe';
import { CategoryStoreService } from '../../../services/category-store.service';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FilterCategoryPipe],
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.scss'],
})
export class TransactionEditComponent implements OnInit {
  transactions$: Observable<Transaction[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  selectedTransaction: Transaction | undefined;
  updatedTransaction: Transaction | undefined;
  formTitle: string = '';

  private categoryStoreServices = inject(CategoryStoreService);
  private transactionStoreServices = inject(TransactionStoreService);
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  transactionForm = this.formBuilder.nonNullable.group({
    type: ['expense' as TransactionType, Validators.required],
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    categoryId: [''],
    date: ['', Validators.required],
  });

  editId: any;

  ngOnInit(): void {
    this.categoryStoreServices.initCategory();
    this.transactionStoreServices.initTransaction();

    this.transactions$ = this.transactionStoreServices.transactions$;
    this.categories$ = this.categoryStoreServices.categories$;

    // update
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.formTitle = 'Edit Transaction';
      this.transactions$.subscribe((transactions) =>
        transactions.filter((transaction) => {
          if (transaction.id === this.editId) {
            this.selectedTransaction = transaction;
            this.transactionForm.get('type')?.setValue(transaction.type);
            this.transactionForm.get('title')?.setValue(transaction.title);
            this.transactionForm
              .get('categoryId')
              ?.setValue(transaction.categoryId);
            this.transactionForm.get('amount')?.setValue(transaction.amount);
            this.transactionForm.get('date')?.setValue(transaction.date);
          }
        }),
      );
    } else {
      // add
      this.formTitle = 'Add Transaction';
    }
  }

  updateTransaction(): void {
    if (!this.selectedTransaction || this.transactionForm.invalid) {
      return;
    }

    const updatedTransactionData: Transaction = {
      ...this.selectedTransaction,
      ...this.transactionForm.value,
    };

    this.transactionService
      .updateTransaction(updatedTransactionData)
      .subscribe(() => {
        alert('Transaction updated successfully!');
        this.transactionStoreServices.initTransaction(true);
        this.router.navigate(['/']);
      });
  }

  addTransaction(): void {
    console.log('we are at add transaction.');
    if (this.transactionForm.invalid) return;

    const newTransaction: Transaction = {
      ...this.transactionForm.getRawValue(),
    };

    this.transactionService.addTransaction(newTransaction).subscribe(() => {
      alert('Transaction added seccessfully!');
      this.transactionStoreServices.initTransaction(true);
      this.router.navigate(['/']);
    });
  }

  onSubmit(): void {
    this.editId ? this.updateTransaction() : this.addTransaction();
  }

  cancelEdit(): void {
    this.router.navigate(['/']);
  }
}
