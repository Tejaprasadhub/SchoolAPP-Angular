import { AuthorizationGuard } from './authorization-guard';

describe('AuthorizationGuard', () => {
  it('should create an instance', () => {
    expect(new AuthorizationGuard()).toBeTruthy();
  });
});
