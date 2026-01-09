import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { ChartPreviewComponent } from './chart-preview.component';
import { CategoriesMockService } from '../../../services/mocks/categories.mock.service';
import { CategoriesService } from '../../../services/categories.service';
import { TransactionMockService } from '../../../services/mocks/transaction.mock.service';
import { TransactionService } from '../../../services/transaction.service';

describe('ChartPreviewComponent', () => {
  let component: ChartPreviewComponent;
  let fixture: ComponentFixture<ChartPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPreviewComponent],
      providers: [
        { provide: TransactionService, useClass: TransactionMockService },
        { provide: CategoriesService, useClass: CategoriesMockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
