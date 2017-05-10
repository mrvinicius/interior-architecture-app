import { TestBed, inject } from '@angular/core/testing';

import { AmbienceService } from './ambience.service';

describe('AmbienceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmbienceService]
    });
  });

  it('should ...', inject([AmbienceService], (service: AmbienceService) => {
    expect(service).toBeTruthy();
  }));
});
