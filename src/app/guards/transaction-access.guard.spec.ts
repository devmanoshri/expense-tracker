import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { transactionAccessGuard } from './transaction-access.guard';

describe('transactionAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => transactionAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
