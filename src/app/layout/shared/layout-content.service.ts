import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutContentService {
  private overflowYDefinedSource = new Subject<string>();
  overflowYDefined$ = this.overflowYDefinedSource.asObservable();

  constructor() { }

  setOverflowY(propVal: string) {
    this.overflowYDefinedSource.next(propVal);
  }

}
