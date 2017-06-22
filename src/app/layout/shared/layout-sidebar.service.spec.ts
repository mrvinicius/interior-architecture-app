import { TestBed, inject } from '@angular/core/testing';

import { LayoutSidebarService } from './layout-sidebar.service';

describe('LayoutSidebarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutSidebarService]
    });
  });

  it('should be created', inject([LayoutSidebarService], (service: LayoutSidebarService) => {
    expect(service).toBeTruthy();
  }));
});
