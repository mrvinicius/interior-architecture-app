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
  private tabAjustedSource = new Subject<string>();
  tabAjusted$ = this.tabAjustedSource.asObservable();

  constructor() {}

  ajustTabLayout() {
    this.tabAjustedSource.next();
  }

  setOverflowY(propVal: string) {
    this.overflowYDefinedSource.next(propVal);
  }
}
