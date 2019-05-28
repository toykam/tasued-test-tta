import { TestBed } from '@angular/core/testing';

import { IsOnlineService } from './is-online.service';

describe('IsOnlineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsOnlineService = TestBed.get(IsOnlineService);
    expect(service).toBeTruthy();
  });
});
