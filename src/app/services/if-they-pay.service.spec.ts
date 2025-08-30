import { TestBed } from '@angular/core/testing';

import { IfTheyPayService } from './if-they-pay.service';

describe('IfTheyPayService', () => {
  let service: IfTheyPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IfTheyPayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
