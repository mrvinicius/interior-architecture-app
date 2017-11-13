import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRequestComponent } from './budget-request.component';

describe('BudgetRequestComponent', () => {
  let component: BudgetRequestComponent;
  let fixture: ComponentFixture<BudgetRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
