import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Pipe({
  name: 'sortTransaction',
})
export class SortTransactionPipe implements PipeTransform {
  transform(
    transactions: Transaction[],
    sortBy: keyof Transaction = 'date',
    sortOrder: 'desc' | 'asc' = 'desc'
  ): Transaction[] {
    if (!transactions) {
      return [];
    }

    return [...transactions].sort((a, b) => {
      const aValue =
        (sortBy === 'date' ? new Date(a.date).getTime() : a[sortBy]) ?? 0;
      const bValue =
        (sortBy === 'date' ? new Date(b.date).getTime() : b[sortBy]) ?? 0;

      return typeof bValue === 'number' && typeof aValue === 'number'
        ? this.compareNumbers(sortOrder, aValue, bValue)
        : this.compareStrings(sortOrder, String(aValue), String(bValue));
    });
  }

  compareNumbers(
    sortOrder: 'desc' | 'asc',
    aValue: number,
    bValue: number
  ): number {
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  }

  compareStrings(
    sortOrder: 'desc' | 'asc',
    aValue: string,
    bValue: string
  ): number {
    return sortOrder === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  }
}
