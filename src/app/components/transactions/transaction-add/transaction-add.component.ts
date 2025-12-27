import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/category.model';
import { Transaction } from '../../../models/transaction.model';




@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.scss']
})
export class TransactionAddComponent implements OnChanges {

  @Input() categories: Category[] = [];
  @Input() transaction: Transaction | null = null;

  @Output() save = new EventEmitter<Transaction>();
  @Output() cancel = new EventEmitter<void>();

  model: Transaction = this.empty();

  ngOnChanges() {
    this.model = this.transaction ? { ...this.transaction } : this.empty();
  }

  submit() {
    this.save.emit(this.model);
    this.model = this.empty();
  }

  empty(): Transaction {
    return {
      title: '',
      amount: 0,
      type: 'income',
      categoryId: undefined,
      date: ''
    };
  }
}
