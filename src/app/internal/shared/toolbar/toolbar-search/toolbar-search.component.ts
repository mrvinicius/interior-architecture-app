import { Component, OnInit } from '@angular/core';

import { ToolbarService } from '../shared/toolbar.service';

@Component({
  selector: 'app-toolbar-search',
  template: `
    <mdl-textfield #input (input)="onSearch(input.value)" icon="search" type="text" class="mdl-textfield is-upgraded mdl-textfield--expandable">
      <div>
        <button mdl-button="" mdl-button-type="icon" class="mdl-button mdl-button--icon">
          <mdl-icon class="material-icons">search</mdl-icon>
        </button>
        <div class="mdl-textfield__expandable-holder">
          <input class="mdl-textfield__input ng-pristine ng-valid ng-touched" type="text" id="mdl-textfield-6" placeholder="" autocomplete=""
            pattern=".*">
          <label class="mdl-textfield__label" for="mdl-textfield-6"></label>
          <span class="mdl-textfield__error"></span>
        </div>
      </div>
    </mdl-textfield>
  `
})
export class ToolbarSearchComponent {

  constructor(
    private toolbarService: ToolbarService
  ) { }

  onSearch(value: string): void {
    this.toolbarService.search(value);
  }
}
