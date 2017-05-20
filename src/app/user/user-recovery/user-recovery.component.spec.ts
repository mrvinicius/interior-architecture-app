import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecoveryComponent } from './user-recovery.component';

describe('UserRecoveryComponent', () => {
  let component: UserRecoveryComponent;
  let fixture: ComponentFixture<UserRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
