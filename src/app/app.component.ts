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

  bootIntercom(): boolean {
    if ((<any>this.window).Intercom) {
      (<any>this.window).Intercom("boot", {
        app_id: "r2fwsspu"
      });
      return true;
    }
    console.error('Intercom not avaliable')
    return false;
  }

  ngOnInit() {
    let that = this;
    let intervalId;

    intervalId = setInterval(function () {
      let gtm = (<any>this.window).google_tag_manager;

      if (gtm !== undefined
        && gtm.dataLayer.gtmDom
        && gtm.dataLayer.gtmDom) {

        let intercomLoad = that.bootIntercom()

        if (intercomLoad) {
          (<any>window).intercomBooted = true;
          clearInterval(intervalId);
        }
      }
    }, 500);

  }
}
