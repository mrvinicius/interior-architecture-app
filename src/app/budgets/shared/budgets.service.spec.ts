import { TestBed, inject } from '@angular/core/testing';

import { BudgetsService } from './budgets.service';

describe('BudgetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BudgetsService]
    });
  });

  it('should be created', inject([BudgetsService], (service: BudgetsService) => {
    expect(service).toBeTruthy();
  }));
});
