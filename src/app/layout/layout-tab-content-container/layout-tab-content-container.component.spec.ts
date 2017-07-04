import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTabContentContainerComponent } from './layout-tab-content-container.component';

describe('LayoutTabContentContainerComponent', () => {
  let component: LayoutTabContentContainerComponent;
  let fixture: ComponentFixture<LayoutTabContentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutTabContentContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutTabContentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
