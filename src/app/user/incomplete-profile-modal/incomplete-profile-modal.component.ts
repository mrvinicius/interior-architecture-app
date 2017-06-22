import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MzModalService, MzBaseModal } from "ng2-materialize";

@Component({
    selector: 'incomplete-profile-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
              Perfil incompleto
            </mz-modal-header>
            <mz-modal-content>
                <h6 class="black-secondary-text" style="margin-top: 0">A proposta depende de alguns dados do seu perfil para ser gerada. Tente novamente após completa-lo.</h6>
            </mz-modal-content>
            <mz-modal-footer>
                <a mz-button routerLink="/perfil" [flat]="true" type="button" mz-modal-close>Completar</a>
                <button mz-button [flat]="true" type="button" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `,
})
export class IncompleteProfileModalComponent extends MzBaseModal {

    constructor() {
        super();
        
    }
}