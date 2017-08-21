import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LayoutContentService } from '../../layout/shared/layout-content.service';
import { Project } from '../shared/project';

@Component({
  selector: 'abx-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  project: Project;
  public activeIndex = 0;
  private ngUnsubscribe: Subject<any> = new Subject<any>();


  constructor(
    private activateRoute: ActivatedRoute,
    private layoutContentService: LayoutContentService
  ) {

  }

  public tabChanged({ index }) {
    this.activeIndex = index;
  }

  ngOnInit() {
    this.layoutContentService.ajustTabLayout();

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
