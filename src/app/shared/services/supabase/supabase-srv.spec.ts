import { TestBed } from '@angular/core/testing';

import { SupabaseSrv } from './supabase-srv';

describe('SupabaseSrv', () => {
  let service: SupabaseSrv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseSrv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
