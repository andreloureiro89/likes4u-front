import { TestBed } from '@angular/core/testing';

import { JapService } from './jap.service';

describe('JapService', () => {
  let service: JapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
