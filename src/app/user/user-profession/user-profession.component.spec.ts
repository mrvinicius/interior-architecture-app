import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfessionComponent } from './user-profession.component';

describe('UserProfessionComponent', () => {
  let component: UserProfessionComponent;
  let fixture: ComponentFixture<UserProfessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
