import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { TransactionStoreService } from './transaction-store.service';

describe('TransactionStoreService', () => {
  let service: TransactionStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TransactionStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
