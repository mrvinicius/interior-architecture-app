import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ReflectiveInjector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Event,
  NavigationEnd,
  Router,
} from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.component.scss'],
})
export class InternalComponent implements OnInit {

  constructor(private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }


}
