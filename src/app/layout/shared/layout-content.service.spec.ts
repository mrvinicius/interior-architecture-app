import { TestBed, inject } from '@angular/core/testing';

import { LayoutContentService } from './layout-content.service';

describe('LayoutContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutContentService]
    });
  });

  it('should be created', inject([LayoutContentService], (service: LayoutContentService) => {
    expect(service).toBeTruthy();
  }));
});
