import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category.model';
import { catchError, delay, Observable, of, Subscription } from 'rxjs';
import { CategoryStoreService } from '../../../../services/category-store.service';
import { CategoriesService } from '../../../../services/categories.service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../shared/message/message.service';
import { TransactionType } from '../../../../models/transaction.model';

@Component({
  selector: 'app-category-add-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './category-add-edit.component.html',
  styleUrl: './category-add-edit.component.scss',
})
export class CategoryAddEditComponent {
  @Input() mainCategoryList: Category[] = [];
  @Input() category = {} as Category;
  @Input() isEdit = false;

  @Output() abort = new EventEmitter<void>();

  categories$: Observable<Category[]> = of([]);
  updatedCategory: Category | undefined;

  private categoryService = inject(CategoriesService);
  private categoryStoreServices = inject(CategoryStoreService);

  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private subscription = new Subscription();

  isCategoryError$ = this.categoryStoreServices.categoryHasError$;

  isSaveLoading = false;
  hasSaveError = false;
  isSubmitted = false;

  categoryForm = this.formBuilder.nonNullable.group({
    transactionType: ['income' as TransactionType, Validators.required],
    name: ['', [Validators.required, this.checkDuplicateName()]],
  });

  checkDuplicateName() {
    return (control: AbstractControl) => {
      const enteredName = control.value;
      if (!enteredName) {
        return null;
      }
      const existed = this.mainCategoryList.filter((category) => {
        return category.name.toLocaleLowerCase() === enteredName.toLocaleLowerCase();
      });
      return existed.length ? { duplicateName: true } : null;
    };
  }

  ngOnInit(): void {
    this.categoryStoreServices.fetchCategory();
    this.categories$ = this.categoryStoreServices.categories$;

    if (this.isEdit) {
      if (Object.keys(this.category).length) {
        this.categoryForm.get('transactionType')?.setValue(this.category.type);
        this.categoryForm.get('name')?.setValue(this.category.name);
      }
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isSaveLoading) {
      return;
    }
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    const formValue = this.categoryForm.value;

    const data = Object.assign(this.category, {
      type: formValue.transactionType,
      name: formValue.name,
    });

    this.saveCategory(data, this.isEdit);
  }

  private saveCategory(data: Category, isEdit: boolean): void {
    this.isSaveLoading = true;
    this.hasSaveError = false;

    this.subscription.add(
      this.categoryService
        .saveCategory(data, isEdit ? 'update' : 'add')
        .pipe(
          delay(1000),
          catchError(() => {
            this.hasSaveError = true;
            this.messageService.messsage$ = {
              text: 'Category update error occurred!',
              type: 'danger',
            };
            return of({} as Category);
          }),
        )
        .subscribe(() => {
          this.isSaveLoading = false;
          if (this.hasSaveError) {
            return;
          }
          this.messageService.messsage$ = {
            text: 'Category updated successfully!',
            type: 'success',
          };
          this.categoryStoreServices.fetchCategory(true);
          this.abort.emit();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
