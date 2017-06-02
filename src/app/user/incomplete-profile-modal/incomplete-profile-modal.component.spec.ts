import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteProfileModalComponent } from './incomplete-profile-modal.component';

describe('IncompleteProfileModalComponent', () => {
  let component: IncompleteProfileModalComponent;
  let fixture: ComponentFixture<IncompleteProfileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncompleteProfileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
