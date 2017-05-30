import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingModalComponent } from './billing-modal.component';

describe('BillingModalComponent', () => {
  let component: BillingModalComponent;
  let fixture: ComponentFixture<BillingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
