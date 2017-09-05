import { Component, ViewEncapsulation, OnInit, AfterViewChecked } from '@angular/core';

import { AuthService } from './core/auth.service';
import { ClientService } from './client/shared/client.service';
import { ProfessionalService } from './core/professional.service';
import { ProjectsService } from './projects/shared/projects.service';
import { UserService } from './core/user.service';
import { WindowRef } from './core/window-ref.service';


@Component({
  selector: 'app',
  template: `
    <router-outlet id="layout-content"></router-outlet>
    <abx-spinner></abx-spinner>
  `,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  loading = false;
  window;

  constructor(
    private winRef: WindowRef
  ) {
    this.window = winRef.getNativeWindow();
  }

  bootIntercom(appId) {
    let intervalId;

    intervalId = setInterval(function () {
      console.log('trying boot intercom...');

      if ((<any>this.window).Intercom) {
        (<any>this.window).Intercom("boot", {
          app_id: appId
        });
        console.log('Intercom booted!');
        
        clearInterval(intervalId);
      }
    }, 750);
  }

  ngOnInit() {
    // let that = this;
    // let intervalId;
    
    this.bootIntercom('h3dn7m3s');
    // intervalId = setInterval(function () {
    //   let gtm = (<any>this.window).google_tag_manager;
    //   console.log('trying boot intercom...');

    //   if (gtm !== undefined
    //     && gtm.dataLayer.gtmDom
    //     && gtm.dataLayer.gtmDom) {

    //     let intercomLoad = that.bootIntercom()

    //     if (intercomLoad) {
    //       // (<any>window).intercomBooted = true;
    //       console.log('booted!');

    //       clearInterval(intervalId);
    //     }
    //   }
    // }, 500);

  }
}
