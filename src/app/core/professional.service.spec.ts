import { TestBed, inject } from '@angular/core/testing';

import { ProfessionalService } from './professional.service';

describe('ProfessionalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionalService]
    });
  });

  it('should ...', inject([ProfessionalService], (service: ProfessionalService) => {
    expect(service).toBeTruthy();
  }));
});
