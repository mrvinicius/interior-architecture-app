import { Component, ViewEncapsulation } from '@angular/core';

import { AuthService } from './core/auth.service';
import { ClientService } from './client/shared/client.service';
import { ProfessionalService } from './core/professional.service';
import { ProjectsService } from './projects/shared/projects.service';
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
  constructor() {
  }
}
