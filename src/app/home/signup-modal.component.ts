import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { Professional } from './../core/professional';
import { ProfessionalService } from './../core/professional.service';
import { SpinnerService } from './../core/spinner/spinner.service';

@Component({
    selector: 'signup-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
                Cadastro
            </mz-modal-header>
            <mz-modal-content>
                <p *ngIf="errorMessage && errorMessage.length" class="red-text">{{errorMessage}}</p>
                <form [formGroup]="registerForm">
                    <div class="input-field">
                        <input formControlName="email" id="email" type="email" class="validate">
                        <label for="email">email</label>
                    </div>
                    <div class="input-field">
                        <input formControlName="name" id="name" type="text" class="validate">
                        <label for="name">nome</label>
                    </div>
                </form>
            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button [flat]="true" (click)="addUser()" [disabled]="registerForm.invalid">Enviar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `
})
export class SignupModalComponent extends MzBaseModal {
    registerForm: FormGroup;
    errorMessage: string;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private modalService: MzModalService,
        private spinnerService: SpinnerService,
        private profService: ProfessionalService
    ) {
        super();
        this.registerForm = this.createForm();
    }

    addUser() {
        if (this.registerForm.invalid) {
            this.errorMessage = 'Preencha todos os campos'
            return;
        } else {
            this.errorMessage = undefined;
            this.spinnerService.toggleLoadingIndicator(true);
            let values = this.registerForm.value;
            let prof: Professional =
                new Professional(values.name, values.email);

            this.profService.add(prof, true)
                .subscribe(response => {
                    this.spinnerService.toggleLoadingIndicator(false);

                    if (response.hasError) {
                        this.errorMessage = response.errorMessage;
                    } else {
                        this.router.navigate(['quase-la']);
                    }
                });
        }
    }

    createForm(): FormGroup {
        return this.fb.group({
            email: ['', Validators.required],
            name: ['', Validators.required]
        });
    }
}
