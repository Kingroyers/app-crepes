import { TestBed } from '@angular/core/testing';

import { GlobalEvent } from './global-event';

describe('GlobalEvent', () => {
  let service: GlobalEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
