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

    <!-- example -->
    <ul *ngIf="false" [class.breadcrumb]="useBootstrap">
      <li *ngFor="let url of _urls; let last = last" [ngClass]="{'breadcrumb-item': useBootstrap, 'active': last}"> <!-- disable link of last item -->
        <a role="button" *ngIf="!last && url == prefix" (click)="navigateTo('/')">{{url}}</a>
        <a role="button" *ngIf="!last && url != prefix" (click)="navigateTo(url)">{{friendlyName(url)}}</a>
        <span *ngIf="last">{{friendlyName(url)}}</span>
        <span *ngIf="last && url == prefix">{{friendlyName('/')}}</span>
      </li>
    </ul>
  `
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  @Input() prefix: string = ''; // Static initial Breadcrumb

  public breadcrumbs: IBreadcrumb[];
  public _urls: string[];
  public _routerSubscription: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private bcService: BreadcrumbsService
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(event => {
        this.breadcrumbs = this.bcService.getBreadcrumbs(this.activeRoute.root);
      })
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
