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
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from '../../../../models/category.model';
import { FilterCategoryPipe } from '../../../../pipes/filter-category.pipe';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterCategoryPipe],
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.scss'],
})
export class TransactionFilterComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];

  @Output() transactionTypeChange = new EventEmitter<string | null>();
  @Output() categoryChange = new EventEmitter<string | null>();
  @Output() fromDateChange = new EventEmitter<string>();
  @Output() toDateChange = new EventEmitter<string>();

  private readonly formBuilder = inject(FormBuilder);

  filterForm = this.formBuilder.group({
    transactionType: [''],
    categoryId: [''],
    fromDate: [''],
    toDate: [''],
  });
  selectedCategoryId = '';
  subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.getFormControlByName('transactionType')?.valueChanges.subscribe(
        (transactionType) => {
          this.getFormControlByName('categoryId')?.setValue('');
          this.transactionTypeChange.emit(transactionType);
        },
      ),
    );
    this.subscriptions.add(
      this.getFormControlByName('categoryId')?.valueChanges.subscribe(
        (categoryId) => {
          this.categoryChange.emit(categoryId);
        },
      ),
    );
    this.subscriptions.add(
      this.getFormControlByName('fromDate')?.valueChanges.subscribe(
        (fromDate) => this.fromDateChange.emit(fromDate),
      ),
    );
    this.subscriptions.add(
      this.getFormControlByName('toDate')?.valueChanges.subscribe((toDate) =>
        this.toDateChange.emit(toDate),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getFormControlByName(controlName: string): AbstractControl<any, any> | null {
    return this.filterForm.get(controlName);
  }
}
