import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProposalManagerComponent } from './project-proposal-manager.component';

describe('ProjectProposalManagerComponent', () => {
  let component: ProjectProposalManagerComponent;
  let fixture: ComponentFixture<ProjectProposalManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProposalManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProposalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
