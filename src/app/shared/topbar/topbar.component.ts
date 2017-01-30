import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { SearchFieldComponent } from '../search-field/search-field.component';

@Component({
  selector: 'app-topbar',
  entryComponents: [
    SearchFieldComponent,
  ],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  currentComponent = null;

  @ViewChild('dynamicComponent', { read: ViewContainerRef }) dynamicComponent: ViewContainerRef;

  /**
   * FONTE: http://blog.rangle.io/dynamically-creating-components-with-angular-2/
   * http://plnkr.co/edit/ZXsIWykqKZi5r75VMtw2?p=preview
   * 
   * component: Class for the component you want to create
   * inputs: An object with key/value pairs mapped to input name/input value
   */
  @Input() set componentData(data: { component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs).map((inputName) => { return { provide: inputName, useValue: data.inputs[inputName] }; });
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponent.parentInjector);

    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(data.component);

    // We create the component using the factory and the injector
    let component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicComponent.insert(component.hostView);

    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }

  constructor(
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() { }

}
