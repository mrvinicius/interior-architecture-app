import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { IBreadcrumb } from '../shared/breadcrumb';
import { BreadcrumbsService } from '../shared/breadcrumbs.service';

@Component({
  selector: 'abx-breadcrumb',
  styleUrls: ['./breadcrumbs.component.scss'],
  template: `
    <div class="mb-breadcrumbs">
      <ng-container *ngFor="let bc of breadcrumbs; let last = last; let i = index">
        <a *ngIf="!last"
          [routerLink]="[bc.url]"
          class="breadcrumb">
          <ng-container *ngIf="breadcrumbs.length > 2">
            <span class="hide-on-small-only">{{bc.label}}</span>  
            <span class="show-on-small" style="display: none;">...</span>  
          </ng-container>
          <ng-container *ngIf="breadcrumbs.length <= 2">
            {{bc.label}}
          </ng-container>
        </a>
        <span *ngIf="last" class="breadcrumb">{{bc.label}}</span>      
      </ng-container>
    </div>
  `
})
export class BreadcrumbsComponent  {
  @Input() prefix: string = ''; // Static initial Breadcrumb
  @Input() breadcrumbs: IBreadcrumb[];
}
