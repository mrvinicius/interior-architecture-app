import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutSidebarService {
  private sidebarHiddenSource = new Subject<void>();
  sidebarHidden$ = this.sidebarHiddenSource.asObservable();

  constructor() { }

  hideSidebar() {
    this.sidebarHiddenSource.next();
  }

}
