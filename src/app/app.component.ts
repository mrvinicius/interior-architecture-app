import { Component, ViewEncapsulation, OnInit, AfterViewChecked } from '@angular/core';

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

      if ((<any>this.window).Intercom) {
        (<any>this.window).Intercom("boot", {
          app_id: appId
        });

        clearInterval(intervalId);
      }
    }, 750);
  }

  ngOnInit() {
    let that = this,
      intervalId;

    // Use este caso queira usar o intercom sem G TagManager 
    // this.bootIntercom('h3dn7m3s'); 

    // intervalId = setInterval(function () {
    //   let gtm = (<any>that.window).google_tag_manager;
    //   if (gtm !== undefined
    //     && gtm.dataLayer.gtmDom
    //     && gtm.dataLayer.gtmDom) {
    //       that.bootIntercom('h3dn7m3s');
    //     clearInterval(intervalId);
    //   }
    // }, 500);

  }
}
