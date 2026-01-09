import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoriesService } from '../../../services/categories.service';
import { CategoriesMockService } from '../../../services/mocks/categories.mock.service';
import { TransactionMockService } from '../../../services/mocks/transaction.mock.service';
import { TransactionService } from '../../../services/transaction.service';
import { ManageTransactionComponent } from './manage-transaction.component';

describe('ManageTransactionComponent', () => {
  let component: ManageTransactionComponent;
  let fixture: ComponentFixture<ManageTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTransactionComponent],
      providers: [
              { provide: TransactionService, useClass: TransactionMockService },
              { provide: CategoriesService, useClass: CategoriesMockService },
            ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
