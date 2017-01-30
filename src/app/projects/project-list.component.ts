import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ProjectsService } from './shared/projects.service';
import { SearchService } from '../shared/search-field/search.service';

import { NewProjectDialogComponent } from './new-project-dialog-component/new-project-dialog.component';
import { Project } from './shared/project';
import { ProjectStatus } from './shared/project-status.enum';
import { SearchFieldComponent } from '../shared/search-field/search-field.component'

@Component({
    selector: 'project-list',
    styleUrls: ['project-list.component.scss'],
    templateUrl: 'project-list.component.html',
})
export class ProjectListComponent implements OnInit, OnDestroy {
    dialogRef: MdDialogRef<any>;
    projects: Project[];
    ProjectStatus = ProjectStatus;
    topbarComponentData = null;
    subscription: Subscription;

    constructor(
        private projectService: ProjectsService,
        private router: Router,
        public dialog: MdDialog,
        private searchService: SearchService,
        public viewContainerRef: ViewContainerRef
    ) {
        this.subscription = searchService.searched$.subscribe(
            value => { 
                this.projectService.search(value).then(projects => this.projects = projects)
            }
        );
    }

    getProjects(): void {
        this.projectService.getAll()
            .then(projects => this.projects = projects);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.topbarComponentData = {
            component: SearchFieldComponent,
            inputs: { showNum: 2 }
        };

        this.getProjects();
    }

    openNewProjectDialog() {
        let config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        this.dialogRef = this.dialog.open(NewProjectDialogComponent, config);
        this.dialogRef.componentInstance.param1 = "test value";
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
        });
    }

    redirectToProject(id: number, title: string): void {
        this.router.navigate(['/projetos', id, title]);
    }

    // newProject(): void {
    //     this.dialogRef = this.dialog.open(NewProjectDialogComponent, {
    //         disableClose: false
    //     });

    //     this.dialogRef.afterClosed().subscribe(result => {
    //         console.log('result: ' + result);
    //         this.dialogRef = null;
    //     });
    // }
}
