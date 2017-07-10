import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBudgetManagerComponent } from './project-budget-manager.component';

describe('ProjectBudgetManagerComponent', () => {
  let component: ProjectBudgetManagerComponent;
  let fixture: ComponentFixture<ProjectBudgetManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBudgetManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBudgetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
