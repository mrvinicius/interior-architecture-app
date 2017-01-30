import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SearchService } from './search.service';

@Component({
  selector: 'search-field',
  template: `
    <ul class="topbar__icons">
      <li (click)="input.focus()">
        <a><i class="material-icons">search</i></a>
      </li>
    </ul>
    <form class="right">
      <div class="input-field">
        <input #input (keyup)="onSearch(input.value)" id="search" type="search" required>
        <label for="search"></label>
        <i class="material-icons">close</i>
      </div>
    </form>
  `,
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent {
  // @Output() onSearch = new EventEmitter();

  constructor(
    private searchService: SearchService
  ) { }

  onSearch(value: string) {
    this.searchService.search(value);
  }

  ngOnInit() {
    // this.onSearch.emit('');
  }

}
