import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMockService } from '../../../services/mocks/transaction.mock.service';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionAddEditComponent } from './transaction-add-edit.component';
import { CategoriesService } from '../../../services/categories.service';
import { CategoriesMockService } from '../../../services/mocks/categories.mock.service';

describe('TransactionAddEditComponent', () => {
  let component: TransactionAddEditComponent;
  let fixture: ComponentFixture<TransactionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAddEditComponent],
      providers: [
        { provide: TransactionService, useClass: TransactionMockService },
        { provide: CategoriesService, useClass: CategoriesMockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
