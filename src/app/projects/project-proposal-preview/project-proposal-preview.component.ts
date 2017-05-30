import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-proposal-preview',
  templateUrl: './project-proposal-preview.component.html',
  styleUrls: ['./project-proposal-preview.component.css']
})
export class ProjectProposalPreviewComponent implements OnInit {
  proposalUrl: string = 'https://muuving.qwilr.com/cyQIIcDAStai';

  constructor() { }

  getProposalUrl() {
    return this.proposalUrl;
  }

  ngOnInit() {
  }

}
