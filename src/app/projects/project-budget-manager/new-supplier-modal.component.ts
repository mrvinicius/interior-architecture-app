import { Component } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';

@Component({
    selector: 'abx-supplier-modal',
    template: `
        <mz-modal class="small-modal">
            <mz-modal-header>
                Adicionar fornecedor
            </mz-modal-header>
            <mz-modal-content>

            </mz-modal-content>
            <mz-modal-footer>
                <button mz-button [flat]="true">Criar</button>
                <button mz-button [flat]="true" mz-modal-close>Cancelar</button>
            </mz-modal-footer>
        </mz-modal>
    `,
})
export class NewSupplierModal extends MzBaseModal {
    
    constructor() {
        super();
    }

    addSupplier() {
        // verificar se o fornecedor ja existe pelo nome
    }
}