import { Component } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogActions, MdDialogClose } from '@angular/material'

@Component({
    selector: 'new-project-dialog',
    template: `
        <h1 md-dialog-title>Novo Projeto</h1>
        <form #newProjectForm="ngForm" (ngSubmit)="onSubmit($event)">
            <md-input-container class="example-full-width" >
                <input
                    name="projectTitle"
                    [(ngModel)]="projectTitle"
                    

                    placeholder="título"
                    md-input
                    ngDefaultControl
                    required>
            </md-input-container>

            <div class="right-align">
                <a class="btn btn-flat" (click)="dialogRef.close()">CANCELAR</a>
                <button
                    class="btn btn-flat"
                    [ngClass]="{ 'disabled': !newProjectForm.form.valid }" 
                    [disabled]="!newProjectForm.form.valid"
                    md-dialog-close>CRIAR
                </button>
            </div>
        </form>
    `
})
export class NewProjectDialogComponent {
    projectTitle: string = '';

    constructor(
        public dialogRef: MdDialogRef<NewProjectDialogComponent>
    ) { }

    onSubmit(e: Event) {
        e.preventDefault();
        this.dialogRef.close(this.projectTitle)
    }
}
