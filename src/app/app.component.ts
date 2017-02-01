import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <router-outlet id="rootRouter"></router-outlet>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent { }
