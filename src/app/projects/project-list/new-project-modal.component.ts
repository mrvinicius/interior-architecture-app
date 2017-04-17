import { Component } from '@angular/core';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { ProjectsService } from './../shared/projects.service';

@Component({
    selector: 'new-project-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
                Adicionar projeto
            </mz-modal-header>
            <mz-modal-content>
                <form #newProjectForm="ngForm">
                    <mz-input-container class="">
                        <!--<i mz-icon-mdi mz-input-prefix class="material-icons">email</i>-->
                        <input mz-input #projectTitle (keyup.enter)="submit(projectTitle.value)" [(ngModel)]="projectTitleValue" label='título do projeto' name="ProjectTitle" [validate]="true" id="projectTitle" type="text" required>
                    </mz-input-container>
                </form>
            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button (click)="submit(projectTitle.value)" [disabled]="newProjectForm.form.invalid" [flat]="true">Criar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `
})
export class NewProjectModalComponent extends MzBaseModal {
    projectTitleValue: string;
    // @Output()
    // close: EventEmitter<> = new EventEmitter();

    constructor(
        private modalService: MzModalService,
        private projectsService: ProjectsService
    ) { 
        super();        
    }

    submit(name: string) {
        this.projectsService.defineNewProjectTitleName(name);
        this.modalComponent.close();
    }
}