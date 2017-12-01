import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBudgetSenderComponent } from './supplier-budget-sender.component';

describe('SupplierBudgetSenderComponent', () => {
  let component: SupplierBudgetSenderComponent;
  let fixture: ComponentFixture<SupplierBudgetSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierBudgetSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBudgetSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
