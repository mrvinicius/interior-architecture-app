import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: `
    <h1>
      {{title}}
    </h1>
    <router-outlet id="rootRouter"></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
}
