import { ResolveFn } from '@angular/router';
import { Transaction } from '../../../models/transaction.model';
import { TransactionStoreService } from '../../../services/transaction-store.service';
import { inject } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';

export const transactionsResolver: ResolveFn<Transaction[]> = () => {
  const transactionStoreServices = inject(TransactionService);
  return transactionStoreServices.getTransactions();
};
