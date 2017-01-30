import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


/**
 * FONTE: http://stackoverflow.com/questions/34802210/angular-2-child-component-events-broadcast-to-parent
 * https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
 * 
 */
@Injectable()
export class SearchService {

  // Observable string sources
  private searchedSource = new Subject<string>();

  // Observable string streams
  searched$ = this.searchedSource.asObservable();

  search(value) {
    this.searchedSource.next(value);
  }

}
