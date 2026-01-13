import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models/transaction.model';

interface FilterOptions {
  transactionType: string;
  selectedCategoryId: string | null;
  fromDate: string;
  toDate: string;
}

@Pipe({
  name: 'filterTransaction',
  standalone: true,
})
export class FilterTransactionPipe implements PipeTransform {
  transform(
    transactions: Transaction[],
    filterOptions: FilterOptions,
  ): Transaction[] {
    const { transactionType, selectedCategoryId, fromDate, toDate } =
      filterOptions;

    if (!transactionType && !selectedCategoryId && !fromDate && !toDate) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      //  Filter by type
      if (transactionType && transaction.type !== transactionType) {
        return false;
      }

      // Filter by category
      if (selectedCategoryId && transaction.categoryId !== selectedCategoryId) {
        return false;
      }

      // Filter by date range
      const transactionDate = new Date(transaction.date).getTime();
      if (fromDate && transactionDate < new Date(fromDate).getTime())
        return false;
      if (toDate && transactionDate > new Date(toDate).getTime()) return false;

      return true;
    });
  }
}
