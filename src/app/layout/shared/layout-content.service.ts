import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface Tab {
  title: string;
  selectors: string;
}

@Injectable()
export class LayoutContentService {
  private overflowYDefinedSource = new Subject<string>();
  overflowYDefined$ = this.overflowYDefinedSource.asObservable();
  // private tabsDefinedSource = new Subject<Tab[]>();
  // tabsDefined$ = this.tabsDefinedSource.asObservable();

  constructor() {

  }

  // defineTabs(tabs: Tab[]) {
  //   this.tabsDefinedSource.next(tabs);
  // }

  setOverflowY(propVal: string) {
    this.overflowYDefinedSource.next(propVal);
  }
}
