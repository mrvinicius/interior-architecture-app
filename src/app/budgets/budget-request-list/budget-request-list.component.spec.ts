import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRequestListComponent } from './budget-request-list.component';

describe('BudgetRequestListComponent', () => {
  let component: BudgetRequestListComponent;
  let fixture: ComponentFixture<BudgetRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
