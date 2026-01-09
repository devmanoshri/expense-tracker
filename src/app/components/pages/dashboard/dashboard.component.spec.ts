import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { TransactionMockService } from '../../../services/mocks/transaction.mock.service';
import { CategoriesService } from '../../../services/categories.service';
import { CategoriesMockService } from '../../../services/mocks/categories.mock.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
              { provide: TransactionService, useClass: TransactionMockService },
              { provide: CategoriesService, useClass: CategoriesMockService },
            ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
