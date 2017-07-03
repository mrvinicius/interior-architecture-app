import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MzSpinnerComponent } from 'ng2-materialize';

import { SpinnerService } from './spinner.service';

@Component({
  selector: 'abx-spinner',
  styleUrls: ['./spinner.component.scss'],
  template: `
  <div [style.visibility]="isLoading ? 'visible' : 'hidden'" class="loading-container">
    <mz-spinner class="animation-container"
      [color]>
    </mz-spinner>
  </div>
  `
})
export class SpinnerComponent implements OnInit {
  isLoading = false;
  private subscription: any;

  //we probably want a reference to ElementRef here to do some DOM manipulations
  constructor(public el: ElementRef, public spinnerService: SpinnerService) { }

  showOrHideLoadingIndicator(loading) {
    this.isLoading = loading;
    if (this.isLoading) this.playLoadingAnimation();
    //else cancel the animation?
  }

  playLoadingAnimation() {
    //this will be your implementation to start the loading animation
  }

  ngOnInit() {
    this.subscription = this.spinnerService.loading$.subscribe(loading => this.showOrHideLoadingIndicator(loading));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
