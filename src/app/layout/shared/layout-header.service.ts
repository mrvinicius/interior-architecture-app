import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutHeaderService {
  private headerHiddenSource = new Subject<void>();
  headerHidden$ = this.headerHiddenSource.asObservable();

  constructor() { }

  hideHeader() {
    this.headerHiddenSource.next();
  }
}
