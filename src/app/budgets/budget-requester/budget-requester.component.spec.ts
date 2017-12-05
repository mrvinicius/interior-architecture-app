import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRequesterComponent } from './budget-requester.component';

describe('BudgetRequesterComponent', () => {
  let component: BudgetRequesterComponent;
  let fixture: ComponentFixture<BudgetRequesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetRequesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
