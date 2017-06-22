import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MzModalService, MzBaseModal } from "ng2-materialize";
import { conformToMask } from 'angular2-text-mask';

import { AuthService } from '../../core/auth.service';
import { Client } from '../shared/client';
import { ClientService } from '../shared/client.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.component.html',
  styleUrls: ['./client-modal.component.css']
})
export class ClientModalComponent extends MzBaseModal implements OnInit {
  clientForm: FormGroup;
  errorMessages: string[];

  constructor(
    private auth: AuthService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private spinnerService: SpinnerService
  ) {
    super();
    this.clientForm = this.createClientForm();

  }

  addClient() {
    this.spinnerService.toggleLoadingIndicator(true);
    let c: Client = {
      name: this.clientForm.value.name,
      email: this.clientForm.value.email,
      cpfCnpj: this.clientForm.value.cpfCnpj,
      gender: this.clientForm.value.newClientGenderOpt
    }

    console.log(c);


    if (Boolean(c.cpfCnpj) && Boolean(c.email) && Boolean(c.name) && Boolean(c.gender)) {
      console.log('valid data');

      this.clientService.addByProfessional(c, this.auth.getCurrentUser().id)
        .subscribe(resp => {
          if (resp.HasError) {
            this.errorMessages = resp.errorMessages;
            return;
          } else {
            this.spinnerService.toggleLoadingIndicator(false);
            this.modalComponent.close();
          }
        });
    }

  }

  ngOnInit() {
    // let modalOptions: Materialize.ModalOptions = {
    //   complete: () => {
    //     this.clientService.modalDismissedSource.next({});

    //   }
    // }

    // this.modalComponent.options = modalOptions;

    const cpfCnpjChange$ = this.clientForm.get('cpfCnpj').valueChanges;
    cpfCnpjChange$.debounceTime(250).subscribe((cpfCnpj: string) => {
      // console.log('cpfCnpj', cpfCnpj);
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
        emitEvent: false,

      })
    });
  }

  private createClientForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      newClientGenderOpt: ['', Validators.required],
      cpfCnpj: ['', Validators.required]
    });
  }
}
