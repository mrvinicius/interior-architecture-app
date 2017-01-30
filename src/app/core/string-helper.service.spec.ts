/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StringHelperService } from './string-helper.service';

describe('StringHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringHelperService]
    });
  });

  it('should ...', inject([StringHelperService], (service: StringHelperService) => {
    expect(service).toBeTruthy();
  }));
});
