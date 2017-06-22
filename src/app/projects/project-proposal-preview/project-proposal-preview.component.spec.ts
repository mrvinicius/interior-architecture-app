import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProposalPreviewComponent } from './project-proposal-preview.component';

describe('ProjectProposalPreviewComponent', () => {
  let component: ProjectProposalPreviewComponent;
  let fixture: ComponentFixture<ProjectProposalPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProposalPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProposalPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
