import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TransactionService } from '../../services/transaction.service';
import { CategoriesService } from '../../services/categories.service';

import { Transaction } from '../../models/transaction.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-transaction-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.scss']
})
export class TransactionEditComponent implements OnInit {

  transaction!: Transaction;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadCategories();

    this.transactionService
      .getTransactionById(id)
      .subscribe(data => this.transaction = data);
  }

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .subscribe(data => this.categories = data);
  }

  updateTransaction(): void {
    this.transactionService
      .updateTransaction(this.transaction)
      .subscribe(() => this.router.navigate(['/transactions']));
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }
}
