import { Component, OnInit } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';

import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { ProjectsService } from '../shared/projects.service';

@Component({
    selector: 'new-partner-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
                Adicionar profissional
                
            </mz-modal-header>
            <mz-modal-content>
                <form #newPartnerForm="ngForm">
                    <mz-input-container>
                        <input mz-input
                            [(ngModel)]="partnerName"
                            id="nome"
                            name='Name' label='nome'
                            type="text"
                            required>
                    </mz-input-container>
                    <mz-input-container>
                        <input mz-input (keyup.enter)="submit(newPartnerForm.value, newPartnerForm.valid)"
                            [(ngModel)]="partnerEmail"
                            [validate]="true"
                            id="partnerEmail"
                            name='Email' label='email'
                            type="email"
                            required>
                    </mz-input-container>
                </form>
            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button (click)="submit(newPartnerForm.value)" [disabled]="newPartnerForm.form.invalid" [flat]="true">Adicionar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `
})

export class NewPartnerModalComponent extends MzBaseModal {
    partnerName: string;
    partnerEmail: string;

    constructor(
        private profService: ProfessionalService
    ) {
        super();
    }

    /**
     * Update Profissionais parceiros do profissionao e profissionais envolvidos no projeto 
     */
    submit(values, formValid?: boolean) {
        if (formValid !== undefined)
            if (!formValid) return;

        let partner = new Professional();
        partner.name = values.Name;
        partner.email = values.Email;

        this.profService.add(partner).subscribe();
        this.modalComponent.close();
    }
}
