import {
  ViewContainerRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';

import { ProjectProposalManagerComponent } from '../../projects/project-proposal-manager/project-proposal-manager.component';

@Component({
  selector: 'abx-layout-tab-content-container',
  entryComponents: [ProjectProposalManagerComponent],
  template: `
    <div #dynamicComponentContainer></div>
  `,
})
export class LayoutTabContentContainerComponent {
  currentComponent = null;
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef
  }) dynamicComponentContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {

  }

}
