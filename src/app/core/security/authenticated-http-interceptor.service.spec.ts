import { TestBed } from '@angular/core/testing';

import { AuthenticatedHttpInterceptorService } from './authenticated-http-interceptor.service';

describe('AuthenticatedHttpInterceptorService', () => {
  let service: AuthenticatedHttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticatedHttpInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
