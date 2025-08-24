import { TestBed } from '@angular/core/testing';

import { ZohoService } from './zoho.service';

describe('ZohoService', () => {
  let service: ZohoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZohoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
