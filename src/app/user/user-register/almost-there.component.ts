import { Component } from '@angular/core';

@Component({
    selector: 'almost-there',
    template: `
        <div class="center-align">
            <h1>Quase lá!</h1>
            <h2>Precisamos que você confirme seu endereço de email.</h2>
            <p>Para completar sua inscrição, clique no link no email que te enviamos, não se esqueça de ver na pasta de spam.</p>
            <p>Se não receber o email dentro de 5 minutos, <b>clique aqui</b> para que o email seja enviado novamente.</p>
        <div>
    `
})
export class AlmostThereComponent {

    constructor() { }

}