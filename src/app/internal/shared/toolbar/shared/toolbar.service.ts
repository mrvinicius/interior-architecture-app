import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolbarService {

  private componentInsertedSource = new Subject<string>();
  private hasSearchFieldSource = new Subject<boolean>();
  private searchedSource = new Subject<string>();
  private halfwayFabClickSource = new Subject<any>();

  componentInserted$ = this.componentInsertedSource.asObservable();
  hasSearchField$ = this.hasSearchFieldSource.asObservable();
  searched$ = this.searchedSource.asObservable();
  halfwayFabClick$ = this.halfwayFabClickSource.asObservable();

  constructor() { }

  hasSearchField(hasSearch: boolean) {
    this.hasSearchFieldSource.next(hasSearch);
  }

  insertComponent(component) {
    this.componentInsertedSource.next(component);
  }

  search(value) {
    this.searchedSource.next(value);
  }

  halfwayFabClick(...args) {
    this.halfwayFabClickSource.next(args);
  }

}
