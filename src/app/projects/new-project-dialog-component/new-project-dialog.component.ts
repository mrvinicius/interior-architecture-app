import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogActions, MdDialogClose } from '@angular/material'

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss']
})
export class NewProjectDialogComponent {
  newProjectTitle: string;

  constructor(public dialogRef: MdDialogRef<any>) { }

  createProject(e: Event) {
    e.preventDefault();
  }

}
