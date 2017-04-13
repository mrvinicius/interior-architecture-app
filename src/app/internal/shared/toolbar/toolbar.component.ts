import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { ISubscription, Subscription } from 'rxjs/Subscription';

import { ToolbarService } from './shared/toolbar.service';

import { ToolbarSearchComponent } from './toolbar-search/toolbar-search.component';

export enum ToolbarFabSide {
    Right, Left
}

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicToolbarHeader', { read: ViewContainerRef })
  private dynamicToolbarHeader: ViewContainerRef;
  componentReference: ComponentRef<any>;
  routerEventSubscription: ISubscription;
  subscription: Subscription;
  ToolbarFabSide = ToolbarFabSide;
  private hasSearch: boolean;
  public hasFab: boolean = true;
  private fabSide: ToolbarFabSide = ToolbarFabSide.Left;

  constructor(
    private toolbarService: ToolbarService,
    private resolver: ComponentFactoryResolver,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events.subscribe(
      (event: Event) => {
        if (event instanceof NavigationEnd) {
          this.subscription = this.toolbarService.hasSearchField$.subscribe(
            hasSearch => { hasSearch ? this.insertSearchField() : this.clearSearchField(); }
          )
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.componentReference)
      this.componentReference.destroy();

    this.routerEventSubscription.unsubscribe();

  }

  private insertSearchField(): void {
    this.clearSearchField();
    let componentFactory = this.resolver.resolveComponentFactory(ToolbarSearchComponent);
    this.componentReference = this.dynamicToolbarHeader.createComponent(componentFactory);
  }

  private clearSearchField() {
    this.dynamicToolbarHeader.clear();
  }


  // private updateToolbarContent(snapshot: ActivatedRouteSnapshot): void {
  //   this.clearToolbar();
  //   let toolbar: any = (snapshot.data as { toolbar: Type<Component> }).toolbar;

  //   if (toolbar instanceof Type) {
  //     let factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(toolbar);
  //     let componentRef: ComponentRef<Component> = this.toolbarTarget.createComponent(factory);
  //     this.toolbarComponents.push(componentRef);
  //   }

  //   for (let childSnapshot of snapshot.children) {
  //     this.updateToolbarContent(childSnapshot);
  //   }
  // }

  // private clearToolbar() {
  //   this.toolbarTarget.clear();
  //   for (let toolbarComponenCANCELARt of this.toolbarComponents) {
  //     toolbarComponent.destroy();
  //   }
  // }

}
