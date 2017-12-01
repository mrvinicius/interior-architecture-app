import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../core/auth.service';
import { Client } from '../shared/client';
import { ClientService } from '../shared/client.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'abx-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  private _client: Client;
  private cpfCnpjChangesSubscription$: Subscription;

  @Input() set client(client: Client) {
    this.clientForm = this.createClientForm(client);
    this._client = client;

    const cpfCnpjChange$ = this.clientForm.get('cpfCnpj').valueChanges;
    this.cpfCnpjChangesSubscription$ = cpfCnpjChange$.debounceTime(250).subscribe((cpfCnpj: string) => {
      let cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');

      let mask;

      if (cleanCpfCnpj.length < 12) {
        mask = UtilsService.cpfMask;
      } else {
        mask = UtilsService.cnpjMask;
      }

      let conformedCpfCnpj = conformToMask(cleanCpfCnpj, mask, {
        guide: false,
        placeholderChar: '\u2000'
      });

      this.clientForm.get('cpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
        onlySelf: false,
        emitEvent: false
      })
    });

  }
  @Output() close = new EventEmitter<any>();
  @Output() update = new EventEmitter<Client>();

  get client(): Client {
    return this._client;
  }

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.cpfCnpjChangesSubscription$.unsubscribe();
  }

  closeEditor() {
    this.close.emit();
  }

  disableClient(clientId: string) {

    this.clientService.disableClient(clientId, this.auth.getCurrentUser().id)
      .subscribe(response => {

      });

    this.closeEditor();
  }

  updateClient() {

    let c: Client = {
      id: this._client.id,
      name: this.clientForm.value.name,
      email: this.clientForm.value.email,
      gender: this.clientForm.value.clientGenderOpt,
      cpfCnpj: this.clientForm.value.cpfCnpj,
      isActive: true
    }
    
    if (Boolean(c.cpfCnpj) && Boolean(c.email) && Boolean(c.name) && Boolean(c.gender)) {
      this.update.emit(c);

      this.clientService.update(c, this.auth.getCurrentUser().id)
        .subscribe(clientResp => {
        });
    }
  }

  private createClientForm(client: Client): FormGroup {

    return this.fb.group({
      name: [client.name, Validators.required],
      email: [client.email, Validators.required],
      clientGenderOpt: [client.gender, Validators.required],
      cpfCnpj: [client.cpfCnpj, Validators.required]
    });
  }
}
