import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/category.model';
import { TransactionType } from '../models/transaction.model';

@Pipe({
  name: 'filterCategory',
  standalone: true,
})
export class FilterCategoryPipe implements PipeTransform {
  transform(
    categories: Category[] | null,
    transactionType: TransactionType | null | undefined,
  ): Category[] {
    if (!categories || !transactionType) {
      return categories ?? [];
    }

    return categories.filter((category) => category.type === transactionType);
  }
}
