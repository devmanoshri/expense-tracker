import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Transaction } from '../../../models/transaction.model';
import { Category } from '../../../models/category.model';


@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {

  @Input() transactions: Transaction[] = [];
  @Input() categories: Category[] = [];

  @Output() edit = new EventEmitter<Transaction>();
  @Output() delete = new EventEmitter<string>();

  getCategoryName(id?: string): string {
    return this.categories.find(c => c.id === id)?.name || '';
  }
}
