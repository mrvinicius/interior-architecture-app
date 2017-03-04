import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialogActions, MdDialogClose } from '@angular/material'

import { Professional } from '../../professional/shared/professional';

@Component({
    selector: 'new-pro-partner-dialog',
    template: `
        <h1 md-dialog-title>Novo Profissional</h1>
        <form #newProPartForm="ngForm" (ngSubmit)="onSubmit($event)">
            <md-input-container>
                <input
                    name="name"
                    [(ngModel)]="professional.name"
                    
                    placeholder="nome"
                    md-input
                    ngDefaultControl
                    required>
            </md-input-container>
            <md-input-container>
                <input
                    name="email"
                    [(ngModel)]="professional.email"
                    

                    placeholder="email"
                    md-input
                    ngDefaultControl>
            </md-input-container>


            <div class="right-align">
                <a class="btn btn-flat" (click)="dialogRef.close()">CANCELAR</a>
                <button
                    class="btn btn-flat"
                    [disabled]="!newProPartForm.form.valid"
                    md-dialog-close>ADICIONAR
                </button>
            </div>
        </form>
    `
})
export class NewProPartnerDialogComponent {
    professional: Professional;

                    // [ngClass]="{ 'disabled': !newProPartForm.form.valid }" 
    constructor(
        public dialogRef: MdDialogRef<NewProPartnerDialogComponent>
    ) {
        this.professional = new Professional();
    }

    onSubmit(e: Event) {
        e.preventDefault();
        console.log(this.professional);
        this.dialogRef.close(this.professional);
    }
}
