import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBudgetModalComponent } from './new-budget-modal.component';

describe('NewBudgetModalComponent', () => {
  let component: NewBudgetModalComponent;
  let fixture: ComponentFixture<NewBudgetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBudgetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBudgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
