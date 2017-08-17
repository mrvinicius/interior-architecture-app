import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { ProjectsService } from '../shared/projects.service';

@Component({
    selector: 'abx-project-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
                Criar proposta
            </mz-modal-header>
            <mz-modal-content>
                <form [formGroup]="newProjectForm">
                        <mz-input-container *ngIf="true" class="">
                            <!--<i mz-icon-mdi mz-input-prefix class="material-icons">email</i>-->
                        <input mz-input
                            [label]="newProjectForm.value.archathonProposal ? 'nome da equipe' : 'título do projeto'"
                            (keyup.enter)="submit(newProjectForm.value.title, newProjectForm.value.archathonProposal, newProjectForm.valid)"
                            formControlName="title"
                            name="ProjectTitle"
                            [validate]="true"
                            id="projectTitle"
                            type="text" required>
                    </mz-input-container>
                    <mz-checkbox-container>
                        <input mz-checkbox
                            formControlName="archathonProposal"
                            [filledIn]="false"
                            [label]="'Proposta para o ARCHATHON'"
                            id="archathonProposalCheckbox"
                            type="checkbox">
                    </mz-checkbox-container>
                </form>
            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button (click)="submit(newProjectForm.value.title, newProjectForm.value.archathonProposal, newProjectForm.valid)" [disabled]="newProjectForm.invalid" [flat]="true">Criar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `
})
export class NewProjectModalComponent extends MzBaseModal {
    newProjectForm: FormGroup;
    // @Output()
    // close: EventEmitter<> = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private modalService: MzModalService,
        private projectsService: ProjectsService
    ) {
        super();
        this.newProjectForm = this.createForm();
    }

    submit(title: string, toArchathon: boolean, formValid?: boolean) {
        if (formValid !== undefined)
            if (!formValid) return;

        title = title.trim()
        
        if (toArchathon) {
            this.projectsService.defineNewAtnProjectTitle(title);
        } else {
            this.projectsService.defineNewProjectTitle(title);
        }

        this.modalComponent.close();
    }

    private createForm(): FormGroup {
        return this.fb.group({
            title: ['', Validators.required],
            archathonProposal: [false]
        });
    }
}
