import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {
  loading$: Observable<String>
  private _observer: Observer<String>;

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
