import { TestBed } from '@angular/core/testing';

import { VerifyUrlService } from './verify-url.service';

describe('VerifyUrlService', () => {
  let service: VerifyUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
