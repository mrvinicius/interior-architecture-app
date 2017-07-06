import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Project } from '../shared/project';

export interface TabParentComponent {

}

@Component({
  selector: 'abx-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  project: Project;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(
    private activateRoute: ActivatedRoute
  ) {
    console.log('manager ctor');
  }

  ngOnInit() {
    this.activateRoute.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: { project: Project }) => {
        this.project = data.project;
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
