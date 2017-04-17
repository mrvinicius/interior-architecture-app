import { Component } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

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
                        <input mz-input label='título do projeto' [(ngModel)]="projectTitle" name="ProjectTitle" [validate]="true" id="projectTitle" type="text" required>
                    </mz-input-container>
                </form>
            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button [disabled]="newProjectForm.form.invalid" [flat]="true" mz-modal-close>Criar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `
})
export class NewProjectModalComponent extends MzBaseModal {
    projectTitle: string;


}