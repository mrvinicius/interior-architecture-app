import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAmbienceComponent } from './project-ambience.component';

describe('ProjectAmbienceComponent', () => {
  let component: ProjectAmbienceComponent;
  let fixture: ComponentFixture<ProjectAmbienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAmbienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAmbienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
