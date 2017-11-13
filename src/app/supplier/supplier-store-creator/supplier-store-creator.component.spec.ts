import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierStoreCreatorComponent } from './supplier-store-creator.component';

describe('SupplierStoreCreatorComponent', () => {
  let component: SupplierStoreCreatorComponent;
  let fixture: ComponentFixture<SupplierStoreCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierStoreCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierStoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
