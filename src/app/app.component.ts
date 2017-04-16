import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <router-outlet id="layout-content"></router-outlet>
    <mb-spinner></mb-spinner>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  loading = false;
}
