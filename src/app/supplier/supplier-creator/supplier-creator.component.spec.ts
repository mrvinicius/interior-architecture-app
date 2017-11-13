import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCreatorComponent } from './supplier-creator.component';

describe('SupplierCreatorComponent', () => {
  let component: SupplierCreatorComponent;
  let fixture: ComponentFixture<SupplierCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
