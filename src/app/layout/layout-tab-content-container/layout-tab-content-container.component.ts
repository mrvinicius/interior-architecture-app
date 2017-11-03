import {
  ViewContainerRef,
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactory,
  ComponentFactoryResolver,
  ReflectiveInjector
} from '@angular/core';

// import { ProjectProposalManagerComponent } from '../../projects/project-proposal-manager/project-proposal-manager.component';

@Component({
  selector: 'abx-layout-tab-content-container',
  entryComponents: [
    // ProjectProposalManagerComponent
  ],
  template: `
    <div #dynamicComponentContainer></div>
  `,
})
export class LayoutTabContentContainerComponent {
  currentComponent = null;
  @ViewChild('dynamicComponentContainer', {
    read: ViewContainerRef
  }) container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {

  }

  @Input() set componentData(data: { componentType: any }) {
    if (!data) {
      return;
    }

    this.container.clear();

    //   // Inputs need to be in the following format to be resolved properly
    //   let inputProviders = Object.keys(data.inputs).map((inputName) =>
    //   { return { provide: inputName, useValue: data.inputs[inputName] }; });

    //   let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    let injector = ReflectiveInjector.
      fromResolvedProviders([], this.container.parentInjector)

    // We create a factory out of the component we want to create
    const factory = this.resolver.resolveComponentFactory(data.componentType);

    // We create the component using the factory and the injector
    let component = factory.create(injector);

    // We insert the component into the dom container
    this.container.insert(component.hostView);

    // Destroy the previously created component
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }
}
