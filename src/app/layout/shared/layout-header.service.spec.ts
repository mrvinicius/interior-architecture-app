import { TestBed, inject } from '@angular/core/testing';

import { LayoutHeaderService } from './layout-header.service';

describe('LayoutHeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutHeaderService]
    });
  });

  it('should ...', inject([LayoutHeaderService], (service: LayoutHeaderService) => {
    expect(service).toBeTruthy();
  }));
});
