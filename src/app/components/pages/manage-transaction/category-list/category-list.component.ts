import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { catchError, delay, of, Subscription, take } from 'rxjs';
import { Category } from '../../../../models/category.model';
import { CategoriesService } from '../../../../services/categories.service';
import { CategoryStoreService } from '../../../../services/category-store.service';
import { MessageService } from '../../../shared/message/message.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { CategoryAddEditComponent } from '../category-add-edit/category-add-edit.component';

@Component({
  selector: 'app-category-list',
  imports: [ModalComponent, CategoryAddEditComponent, NgClass, AsyncPipe],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnChanges {
  @Input() mainCategoryList: Category[] = [];

  private categoryService = inject(CategoriesService);
  private categoryStoreServices = inject(CategoryStoreService);
  private messageService = inject(MessageService);

  sortedList: Category[] = [];
  selectedCategory = {} as Category;
  showModal = false;
  showConfirmationModal = false;
  isCategoryDeleting = false;
  hasCategoryDeleteError = false;
  isEdit = false;
  selectedCategoryId = '';
  isLoading$ = this.categoryStoreServices.categoryHasLoading$;

  private subscription = new Subscription();

  ngOnChanges(changes: SimpleChanges): void {
    this.createLists();
  }

  createLists(): void {
    this.sortedList = [
      ...this.mainCategoryList
        .filter((category) => {
          return category.type === 'income';
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      ...this.mainCategoryList
        .filter((category) => {
          return category.type === 'expense';
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }

  onDeleteConfirmation(): void {
    if (this.isCategoryDeleting) {
      return;
    }
    this.isCategoryDeleting = true;
    this.hasCategoryDeleteError = false;

    this.subscription.add(
      this.categoryService
        .deleteCategory(this.selectedCategoryId)
        .pipe(
          take(1),
          catchError(() => {
            this.hasCategoryDeleteError = true;
            this.messageService.messsage$ = {
              text: 'Category deletion error occurrd!',
              type: 'danger',
            };
            return of(null);
          }),
        )
        .subscribe(() => {
          this.isCategoryDeleting = false;
          if (this.hasCategoryDeleteError) {
            return;
          }
          this.categoryStoreServices.fetchCategory(true);
          this.showConfirmationModal = false;
          this.messageService.messsage$ = {
            text: 'Category deleted successfully',
            type: 'success',
          };
        }),
    );
  }

  onDeleteClick(selectedCategoryId: string): void {
    this.selectedCategoryId = selectedCategoryId;
    this.showConfirmationModal = true;
  }

  onDeleteCancel(): void {
    this.selectedCategoryId = '';
    this.showConfirmationModal = false;
  }

  onModalClose(): void {
    this.showModal = false;
    this.selectedCategory = {} as Category;
  }

  onAddOrEditClick(category = {} as Category, isEdit = false): void {
    this.selectedCategory = category;
    this.isEdit = isEdit;
    this.showModal = true;
  }
}
