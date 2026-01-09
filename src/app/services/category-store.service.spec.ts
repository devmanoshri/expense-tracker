import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CategoryStoreService } from './category-store.service';

describe('CategoryStoreService', () => {
  let service: CategoryStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CategoryStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
