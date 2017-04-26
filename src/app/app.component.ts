import { Component, ViewEncapsulation } from '@angular/core';

import { AuthService } from './core/auth.service';
import { ProfessionalService } from './core/professional.service';
import { UserService } from './core/user.service';

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

  /**
   *
   */
  constructor(
    private auth: AuthService,
    private profService: ProfessionalService
  ) {
  }
}
