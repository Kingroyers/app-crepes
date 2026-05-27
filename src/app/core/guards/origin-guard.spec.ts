import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { originGuard } from './origin-guard';

describe('originGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => originGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
