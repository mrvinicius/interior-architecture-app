import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {
  public loading$: Observable<{}>
  private _observer: Observer<{}>;

  constructor() {
    this.loading$ = new Observable(
      observer => this._observer = observer).share();
  }
  
  toggleLoadingIndicator(isAtive) {
    if (this._observer) {
      this._observer.next(isAtive);
    }
  }
}
