import { Component, OnInit, Optional, ViewContainerRef } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { ToolbarService } from '../../shared/toolbar/shared/toolbar.service';
import { ToolbarSearchComponent } from '../../shared/toolbar/toolbar-search/toolbar-search.component';

import { NewProjectDialogComponent } from './new-project-dialog.component';

import {
  Project,
  PROJECTS,
  ProjectsService,
  ProjectStatus
} from '../shared';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  ProjectStatus = ProjectStatus;
  subscription: Subscription;
  navButtonSubscription: Subscription;
  routerEventSubscription: ISubscription;
  dialogRef: MdDialogRef<any>;
  newProjectTitle: string;

  constructor(
    private projectService: ProjectsService,
    private router: Router,
    @Optional()
    private toolbarService: ToolbarService,
    private mdDialog: MdDialog,
    private viewContainerRef: ViewContainerRef
  ) {
    this.subscription = toolbarService.searched$.subscribe(
      value => {
        this.projectService.search(value).then(projects => this.projects = projects)
      }
    );

    this.navButtonSubscription = toolbarService.halfwayFabClick$.subscribe(
      args => { this.showNewProjectDialog() }
    )
  }

  getProjects(): void {
    this.projectService.getAll()
      .then(projects => this.projects = projects);
  }

  ngOnInit() {
    this.routerEventSubscription = this.router.events.subscribe(
      (event: Event) => {
        if (event instanceof NavigationEnd) {
          this.router.url === '/projetos' ? this.toolbarService.hasSearchField(true) : this.toolbarService.hasSearchField(false)
        }
      }
    );
    this.getProjects();
  }

  public showNewProjectDialog() {
    let dialogConfig = new MdDialogConfig();
    dialogConfig.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.mdDialog.open(NewProjectDialogComponent, dialogConfig);
    this.dialogRef.componentInstance.param1 = "Test"
    this.dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.beginNewProject(result);
    });
  }

  beginNewProject(title: string) {
    let id = this.projectService.addProject(title);
    this.redirectToProject(id);
  }

  redirectToProject(id: number, title?: string): void {
    this.router.navigate(['/projetos', id]);
  }

}
