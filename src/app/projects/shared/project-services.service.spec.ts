import { TestBed, inject } from '@angular/core/testing';

import { ProjectServicesService } from './project-services.service';

describe('ProjectServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectServicesService]
    });
  });

  it('should ...', inject([ProjectServicesService], (service: ProjectServicesService) => {
    expect(service).toBeTruthy();
  }));
});
