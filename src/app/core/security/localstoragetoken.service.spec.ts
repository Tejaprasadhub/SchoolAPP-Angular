import { TestBed } from '@angular/core/testing';

import { LocalstoragetokenService } from './localstoragetoken.service';

describe('LocalstoragetokenService', () => {
  let service: LocalstoragetokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstoragetokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
