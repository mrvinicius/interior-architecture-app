import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdlExpansionPanelComponent } from '@angular-mdl/expansion-panel';
import { conformToMask } from 'angular2-text-mask';
import { default as cep, CEP } from 'cep-promise';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { MzSelectDirective, MzModalService, MzToastService } from 'ng2-materialize';
import { TagInputComponent } from 'ng2-tag-input';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';

import { Ambience } from '../shared/ambience';
import { AmbienceDescription } from '../shared/ambience-description.enum';
import { AmbienceService } from '../shared/ambience.service';
import { AuthService } from '../../core/auth.service';
import { Bank } from '../../billing/shared/bank';
import { BankService } from '../../billing/shared/bank.service';
import { BankAccountService } from '../../billing/shared/bank-account.service';
import { BankAccount } from '../../billing/shared/bank-account';
import { BillingModalComponent } from '../../billing/billing-modal/billing-modal.component';
import { BillingService } from '../../billing/shared/billing.service';
import { CanComponentDeactivate } from '../../core/can-deactivate-guard.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Delivery } from '../shared/delivery';
import { DeliveryDescription } from '../shared/delivery-description.enum';
import { IncompleteProfileModalComponent } from '../../user/incomplete-profile-modal/incomplete-profile-modal.component';
import { LayoutContentService } from './../../layout/shared/layout-content.service';
import { NewPartnerModalComponent } from './new-partner-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Proposal } from '../shared/proposal';
import { ProposalService } from '../shared/proposal.service';
import { Service } from '../shared/service.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { TimeUnity } from '../../shared/time-unity.enum';
import { UF } from '../../shared/uf.enum';
import { UtilsService } from '../../shared/utils/utils.service';
import { WindowRef } from '../../core/window-ref.service';

export interface TabParentComponent {

}

@Component({
  selector: 'abx-project-proposal-manager',
  templateUrl: './project-proposal-manager.component.html',
  styleUrls: ['./project-proposal-manager.component.scss']
})
export class ProjectProposalManagerComponent implements OnInit, OnDestroy {
  // Refers to component global variables
  ambienceDescriptions: string[];
  ambienceSlug: string;
  addressNumberMask = UtilsService.addressNumberMask;
  cepMask = UtilsService.cepMask;
  agencyMask = UtilsService.bankAccountAgencyMask;
  bankAccountMask = UtilsService.bankAccountNumberMask;
  deliveryDescriptions: string[];
  professional: Professional;
  professionals: Professional[];
  professionalAddedSubscription: Subscription;
  @Input() project: Project;
  projectSlugTitle: string;
  services: string[];
  nativeWindow: any;
  mascaraReal = createNumberMask({
    prefix: 'R$',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',', // allowLeadingZeroes: true,
    allowDecimal: true, // requireDecimal: true
  });
  allBanks: Bank[];
  bankAccounts: BankAccount[];

  // Refers to Client section variables
  clientErrorMessages: string[];
  clientDataHasChanged: boolean;
  clientDataBeingSaved: boolean;
  clientSaved: boolean = true;
  clientForm: FormGroup;
  clientFormChangesSubscription: Subscription;

  addressFieldsDisabled: boolean = false;
  locationDataHasChanged: boolean;
  locationDataBeingSaved: boolean;
  locationSaved: boolean = true;
  locationForm: FormGroup;
  locationFormChangesSubscription: Subscription;

  // Refers to Professional section variables
  profDataHasChanges: boolean;
  profDataBeingSaved: boolean;
  profForm: FormGroup;
  profFormChangesSubscription: Subscription;

  partnersDataHasChanges: boolean;
  partnersDataBeingSaved: boolean;
  partnersForm: FormGroup;
  partnersFormChangesSubscription: Subscription;
  @ViewChild('partnersInput') partnersInput: TagInputComponent;

  proposalIntroDataHasChanges: boolean;
  proposalIntroDataBeingSaved: boolean;
  proposalIntroForm: FormGroup;
  proposalIntroFormChangesSubscription: Subscription;

  // Refers to Proposal section variables
  proposalDataHasChanges: boolean;
  proposalDataBeingSaved: boolean;
  proposalForm: FormGroup;
  proposalFormChangesSubscription: Subscription;

  deliveryDataHasChanges: boolean[] = [];
  deliveryDataBeingSaved: boolean;
  deliveriesForms: FormGroup[] = [];
  deliveryFormsChangesSubscription: Subscription[] = [];
  selectedDeliveriesForm: FormGroup;
  // selectedDeliveries: number[] = [];

  ambiencesDataHasChanges: boolean[] = [];
  ambiencesDataBeingSaved: boolean;
  ambiencesForms: FormGroup[] = [];
  ambiencesFormsChangesSubscription: Subscription[] = [];

  // Refers to Payment section variables
  paymentDataHasChanges: boolean;
  paymentDataBeingSaved: boolean;
  paymentForm: FormGroup;
  paymentFormChangesSubscription: Subscription;

  bankAccountDataHasChanges: boolean;
  bankAccountDataBeingSaved: boolean;
  bankAccountForm: FormGroup;
  bankAccountFormChangesSubscription: Subscription;

  billingInfoUpdatedSubscription: Subscription;

  constructor(
    private ambienhomeceService: AmbienceService,
    private auth: AuthService,
    private bankService: BankService,
    private bankAccService: BankAccountService,
    private billingService: BillingService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private layoutContentService: LayoutContentService,
    private modalService: MzModalService,
    private toastService: MzToastService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private propService: ProposalService,
    private router: Router,
    private spinnerService: SpinnerService,
    private winRef: WindowRef
  ) {
    console.log('prop mang ctor');
    
    this.ambienceDescriptions = UtilsService.getEnumArray(AmbienceDescription);
    this.deliveryDescriptions = UtilsService.getEnumArray(DeliveryDescription);
    this.services = UtilsService.getEnumArray(Service);
    this.profService.getCurrentProfessional().subscribe(prof => this.professional = prof);
    this.nativeWindow = winRef.getNativeWindow();
  }

  allClients(): Client[] {
    return this.clientService.allClients;
  }

  beginAmbience() {
    if (this.project.ambiences === undefined)
      this.project.ambiences = []

    this.project.ambiences.push(new Ambience());
  }

  beginDelivery() {
    if (this.project.activeProposal.deliveries === undefined)
      this.project.activeProposal.deliveries = []

    let newLength = this.project.activeProposal.deliveries.push(new Delivery());
  }

  canDeactivate(): boolean {
    return !this.clientDataBeingSaved
      && !this.profDataBeingSaved
      && !this.proposalDataBeingSaved
      && !this.ambiencesDataBeingSaved
      && !this.paymentDataBeingSaved;
  }

  disableDelivery(deliveryIndex: number, selectedIndexes: number[]) {

    if (this.deliveryFormsChangesSubscription
      && this.deliveryFormsChangesSubscription[deliveryIndex]
      && !this.deliveryFormsChangesSubscription[deliveryIndex].closed) {
      this.deliveryFormsChangesSubscription[deliveryIndex].unsubscribe();
    }

    if (this.project.activeProposal.deliveries
      && this.project.activeProposal.deliveries[deliveryIndex]) {
      this.project.activeProposal.deliveries.splice(deliveryIndex, 1);
    }
  }

  generateProposal() {
    this.spinnerService.toggleLoadingIndicator(true);

    let profileIncomplete: boolean =
      !Boolean(this.profService.professional.name)
      || !Boolean(this.profService.professional.addressArea)
      || !Boolean(this.profService.professional.addressNumber)
      || !Boolean(this.profService.professional.celular)
      || !Boolean(this.profService.professional.CEP)
      || !Boolean(this.profService.professional.cpfCnpj)
      || !Boolean(this.profService.professional.maritalStatus);

    if (profileIncomplete) {
      this.spinnerService.toggleLoadingIndicator(false);
      this.modalService.open(IncompleteProfileModalComponent);
    } else {
      if (this.project.client && this.project.client.id) {
        this.openProposal(this.router.url + '/proposta/'
          + this.project.id);
        this.spinnerService.toggleLoadingIndicator(false);
      } else {
        this.spinnerService.toggleLoadingIndicator(false);
        this.toastService.show('Selecione um cliente', 2500);
      }
    }
  }

  getPartnersByIds(ids: any[]): Professional[] {
    return this.professionals.filter(prof => ids.includes(prof.id));
  }

  getProjects(): Project[] {
    return this.projectsService.allProjects;
  }

  ngOnInit() {    
    this.clientForm = this.createClientForm(this.project);
    this.clientFormChangesSubscription = this.subscribeToFormChanges(this.clientForm, () => {
      this.clientDataHasChanged = true;
    }, (formData) => {
      if (!this.clientDataBeingSaved) {
        this.clientDataHasChanged = false;
        this.clientDataBeingSaved = true;
        this.saveClientInfo().subscribe((resp) => {
          this.clientErrorMessages = [];

          if (resp !== undefined) {
            if (resp.HasError) {
              this.clientErrorMessages = resp.errorMessages;
              this.clientDataBeingSaved = false;
            } else {
              if (resp.client !== undefined) {
                this.project.client = resp.client;
                this.clientForm.value.clientId = resp.client.id;
              } else if (resp instanceof Client) {
                this.project.client = resp;
                this.clientForm.value.clientId = resp.id;
              }

              this.clientForm.reset();
              this.saveProjectInfo((success) => {
                if (success) {
                  this.clientDataBeingSaved = false;
                }
              });
            }
          } else {
            this.clientDataBeingSaved = false;
          }
        });
      }
    });
    const cpfCnpjChange$ = this.clientForm.get('cpfCnpj').valueChanges;
    cpfCnpjChange$.debounceTime(250).subscribe((cpfCnpj: string) => {
      // console.log('cpfCnpj', cpfCnpj);
      if (cpfCnpj) {
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
      }
    });

    this.locationForm = this.createLocationForm(this.project);
    this.locationFormChangesSubscription = this.subscribeToFormChanges(this.locationForm, () => {
      this.locationDataHasChanged = true;
    }, (formData) => {
      console.log(formData);
      let cleanCep = formData.CEP.replace(/\D/g, '');

      if (!this.locationDataBeingSaved && !this.addressFieldsDisabled && String(cleanCep).length > 7) {
        console.log('Will save location');

        this.locationDataHasChanged = false;
        this.locationDataBeingSaved = true;
        this.saveLocationInfo(formData);
        this.saveProjectInfo((success: boolean) => {
          this.locationDataBeingSaved = success ? false : false;
        })
      }
    });

    const cepChange$ = this.locationForm.get('CEP').valueChanges;
    cepChange$.debounceTime(200).subscribe((cep: string) => {
      if (cep) {
        let cleanCep = cep.replace(/\D/g, '');
        this.findLocationByCEP(cleanCep);
      }
    });

    this.profForm =
      this.createProfessionalForm(this.professional);

    this.profFormChangesSubscription = this.subscribeToFormChanges(this.profForm, () => {
      this.profDataHasChanges = true;
    }, (formData) => {
      if (!this.profDataBeingSaved) {
        this.profDataHasChanges = false;
        this.profDataBeingSaved = true;
        this.saveProfessionalInfo().subscribe(response => {
          if (response !== undefined) {
            this.saveProjectInfo((success) => {
              if (success) {
                this.profDataBeingSaved = false;
              } else {
                this.profDataBeingSaved = false;
              }
            });
          }
        });
      }
    });

    this.profService.getAll()
      .subscribe(profs => {
        this.professionals = profs && profs.length ? profs : []
      });

    let deliveriesIndexes: number[] = [];

    if (this.project.activeProposal.deliveries !== undefined) {
      deliveriesIndexes = this.project.activeProposal.deliveries.map(delivery => {
        return delivery.deliveryDescription
      });
    }

    this.selectedDeliveriesForm =
      this.createSelectedDeliveriesForm(deliveriesIndexes);
    const selectedDeliveriesFormChanges$ =
      this.selectedDeliveriesForm.get('selectedDeliveries').valueChanges;

    selectedDeliveriesFormChanges$.debounceTime(3000).subscribe((indexes: number[]) => {

      // console.log('value: ', indexes);
      this.deliveryDataBeingSaved = true;
      this.deliveryDescriptions.forEach((descStr, index) => {
        if (indexes.includes(index)) {
          // this.deliveryDataHasChanges[index] = true;
        } else {
          this.disableDelivery(index, indexes);
        }
      });

      this.saveDeliveriesInfo().subscribe(result => {
        if (result !== undefined) {
          if (result === true) {
            this.saveProjectInfo((success) => {
              this.deliveryDataBeingSaved = false;

            })
          }
        }
      });
    });

    let introValue = '';
    if (this.project.activeProposal.intro !== undefined)
      introValue = this.project.activeProposal.intro;

    this.proposalIntroForm = this.fb.group({
      proposalIntro: [introValue]
    })

    const introChanges$ = this.proposalIntroForm.get('proposalIntro').valueChanges;
    introChanges$.debounceTime(3000).subscribe(value => {
      this.spinnerService.toggleLoadingIndicator(true);

      this.project.activeProposal.intro = this.proposalIntroForm.value.proposalIntro;
      this.saveProjectInfo((success) => {
        this.spinnerService.toggleLoadingIndicator(false);
      })
    })

    this.proposalForm = this.createProposalForm(this.project);
    this.proposalFormChangesSubscription = this.subscribeToFormChanges(this.proposalForm, () => {
      this.proposalDataHasChanges = true;
    }, (formData) => {
      if (!this.proposalDataBeingSaved) {
        this.proposalDataHasChanges = false;
        this.proposalDataBeingSaved = true;
        this.saveProposalInfo().subscribe(result => {
          if (result !== undefined) {
            this.saveProjectInfo((success) => {
              if (success) {
                this.proposalDataBeingSaved = false;
              }
            });
          }
        });
      }
    });

    this.paymentForm = this.createPaymentForm(this.project.activeProposal.costFinal);
    const finalCostChanges$ = this.paymentForm.get('cost').valueChanges;
    finalCostChanges$.debounceTime(3000).subscribe(value => {
      this.spinnerService.toggleLoadingIndicator(true);
      this.project.activeProposal.costFinal = UtilsService.parseMonetaryString(value)

      if (!this.project.activeProposal.costFinal)
        this.project.activeProposal.costFinal = 0;

      this.saveProjectInfo((success) => {
        this.spinnerService.toggleLoadingIndicator(false);
      })
    })


    this.bankService.getAll().subscribe(banks => this.allBanks = banks);
    this.bankAccService.getAllByProfessional(this.auth.getCurrentUser().id)
      .subscribe(bankAccs => { this.bankAccounts = bankAccs ? bankAccs : [] });

    this.bankAccountForm = this.createBankAccountForm(this.professional, this.project.activeProposal.bankAccount);
    this.bankAccountFormChangesSubscription = this.subscribeToFormChanges(this.bankAccountForm, () => {
      this.bankAccountDataHasChanges = true;
    }, (formData) => {

      if (!this.bankAccountDataBeingSaved) {
        this.bankAccountDataHasChanges = false;
        this.bankAccountDataBeingSaved = true;
        this.saveBankAccountInfo(formData).subscribe((bankAcc: BankAccount) => {

          if (bankAcc !== undefined) {
            this.project.activeProposal.bankAccount = bankAcc;

            if (formData.bankAccountId === 'new' || formData.bankAccountId === 'undefined') {
              this.saveProjectInfo((success) => {
                if (success) {
                  this.bankAccountForm.reset();
                  this.bankAccounts.push(bankAcc);
                  this.bankAccountForm.value.bankAccountId = bankAcc.id;
                  this.bankAccountDataBeingSaved = false;
                }
              });
            } else {
              this.saveProjectInfo((success) => {
                if (success) {
                  this.bankAccountDataBeingSaved = false;
                }
              });
            }


          } else {
            this.bankAccountDataBeingSaved = false;
          }
        });
      }
    });
    const bankAccountCpfCnpjChange$ = this.bankAccountForm.get('accountCpfCnpj').valueChanges;
    bankAccountCpfCnpjChange$.debounceTime(500).subscribe((cpfCnpj: string) => {
      // console.log('cpfCnpj', cpfCnpj);
      if (cpfCnpj) {
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

        this.bankAccountForm.get('accountCpfCnpj').setValue(conformedCpfCnpj.conformedValue, {
          onlySelf: false,
          emitEvent: false,
        })
      }
    });
    this.professionalAddedSubscription = this.profService.professionalAdded$
      .subscribe((newProfessional: Professional) => {
        this.partnersInput.appendTag({
          id: newProfessional.id,
          value: newProfessional.id,
          name: newProfessional.name,
          display: newProfessional.name
        });

      });
  }

  ngOnDestroy() {
    if (!this.clientFormChangesSubscription.closed)
      this.clientFormChangesSubscription.unsubscribe();

    if (!this.profFormChangesSubscription.closed)
      this.profFormChangesSubscription.unsubscribe();

    if (!this.proposalFormChangesSubscription.closed)
      this.proposalFormChangesSubscription.unsubscribe();

    this.ambiencesFormsChangesSubscription.forEach(subscription => {
      if (!subscription.closed) subscription.unsubscribe()
    });

    // if (!this.paymentFormChangesSubscription.closed)
    //   this.paymentFormChangesSubscription.unsubscribe();

    if (this.professionalAddedSubscription && !this.professionalAddedSubscription.closed)
      this.professionalAddedSubscription.unsubscribe();
    // this.newAmbienceFormChangesSubscription.unsubscribe();

    if (this.billingInfoUpdatedSubscription &&
      !this.billingInfoUpdatedSubscription.closed) {

      this.billingInfoUpdatedSubscription.unsubscribe();
    }
  }

  openBillingModal() {
    let modalRef = this.modalService.open(BillingModalComponent, {});
  }

  openNewPartnerModal() {
    let modalRef = this.modalService.open(NewPartnerModalComponent, {});
  }

  parseMonetaryString(value: string): number {
    return UtilsService.parseMonetaryString(value);
  }

  removeAmbience(ambienceIndex: number) {
    this.ambiencesFormsChangesSubscription[ambienceIndex].unsubscribe();
    this.ambiencesFormsChangesSubscription.splice(ambienceIndex, 1);
    this.ambiencesForms.splice(ambienceIndex, 1);
    this.project.ambiences.splice(ambienceIndex, 1);
    this.ambiencesDataHasChanges[ambienceIndex] = true;
    this.saveAmbiencesInfo().subscribe(result => {
      if (result !== undefined) {
        if (result === true) {
          this.saveProjectInfo((success) => {
            if (success) {
              this.ambiencesDataBeingSaved = false;
            } else {
              this.ambiencesDataBeingSaved = false;
            }
          });
        }
      }
    })
  }

  setAmbienceForm(ambienceIndex: number) {
    if (this.ambiencesForms[ambienceIndex] === undefined) {
      this.ambiencesForms[ambienceIndex] =
        this.createAmbienceForm(this.project.ambiences[ambienceIndex]);

      this.ambiencesFormsChangesSubscription[ambienceIndex] =
        this.subscribeToFormChanges(this.ambiencesForms[ambienceIndex], () => {
          this.ambiencesDataHasChanges[ambienceIndex] = true;
        }, (formData) => {
          if (!this.ambiencesDataBeingSaved) {
            this.ambiencesDataBeingSaved = true;
            this.saveAmbiencesInfo().subscribe((result: boolean) => {
              console.log(result);

              if (result !== undefined) {
                if (result === true) {
                  this.saveProjectInfo((success) => {
                    if (success) {
                      this.ambiencesDataBeingSaved = false;
                    } else {
                      this.ambiencesDataBeingSaved = false;
                    }
                  });
                } else {
                  this.ambiencesDataBeingSaved = false;
                }
              }
            });
          }
        });
    }

    return true;
  }

  setDeliveryForm(deliveryIndex: number): boolean {
    if (this.deliveriesForms[deliveryIndex] === undefined) {
      let delivery: Delivery;

      if (this.project.activeProposal.deliveries && this.project.activeProposal.deliveries.length) {
        // verficiar se a entrega ja foi selecionada


        delivery = this.project.activeProposal.deliveries.find(d => {
          if (d !== undefined) {
            return d.deliveryDescription === DeliveryDescription[DeliveryDescription[deliveryIndex]]
          } else {
            return false;
          }
        });


      }

      if (delivery === undefined) delivery = new Delivery();
      this.deliveriesForms[deliveryIndex] = this.createDeliveryForm(delivery);

      this.deliveryFormsChangesSubscription[deliveryIndex] =
        this.subscribeToFormChanges(this.deliveriesForms[deliveryIndex], (formData) => {
          this.deliveryDataHasChanges[deliveryIndex] = true;


          // let deliveryDescIndex = Number(formData.description);
          // console.log(deliveryDescIndex);

          // if (deliveryIndex !== NaN && deliveryDescIndex >= 0) {
          //   // this.deliveryDescriptions[deliveryIndex].slice(deliveryIndex, 1);
          //   // this.selectedDeliveries[deliveryIndex] = deliveryDescIndex;
          //   this.selectedDeliveries[deliveryIndex] = deliveryDescIndex;
          // } else {
          //   this.selectedDeliveries[deliveryIndex] = -1;
          // }
        }, (formData) => {
          if (!this.deliveryDataBeingSaved) {

            this.deliveryDataBeingSaved = true;
            this.saveDeliveriesInfo().subscribe((result: boolean) => {
              if (result !== undefined) {
                if (result === true) {
                  this.saveProjectInfo(success => {
                    if (success) {
                      this.deliveryDataBeingSaved = false;
                    }
                  })
                } else {
                  this.deliveryDataBeingSaved = false;
                }
              }
            })
          }
        });
    }

    return true;
  }

  setPartnersForm(): boolean {
    if (this.partnersForm === undefined && this.professionals) {
      this.partnersForm =
        this.createPartnersForm(this.project.activeProposal.professionalsIds, this.professional.id);
      const partnersChange$ = this.partnersForm.get('partners').valueChanges;
      partnersChange$.do((profs: any[]) => {
        let addOptionIndex = profs.findIndex(obj => obj.value === 'new');

        if (addOptionIndex !== -1) {
          profs.splice(addOptionIndex, 1);

          this.partnersForm.get('partners').setValue(profs, {
            onlySelf: false,
            emitEvent: false
          })
          this.openNewPartnerModal()
        } else {
          this.project.activeProposal.professionalsIds = profs.map(p => { return p.value })

          this.partnersDataHasChanges = true;
        }



      }).debounceTime(3000).subscribe(profs => {
        if (!this.partnersDataBeingSaved) {
          this.partnersDataHasChanges = false;
          this.partnersDataBeingSaved = true;
          this.saveProjectInfo((success) => {
            if (success) {
              this.partnersDataBeingSaved = false;
            } else {
              this.partnersDataBeingSaved = false;
            }
          })
        }

      });

    }
    return true;
  }

  showDeliveryState() {
    // console.log(this.selectedDeliveries);
    console.log('subscriptions: ');
    this.deliveryFormsChangesSubscription.forEach(s => { if (!s.closed) console.log(s) })

    console.log('selected deliveries indexes: ', this.selectedDeliveriesForm.value.selectedDeliveries);

    this.deliveriesForms.forEach(form => {
      console.log(form.value);
    });

  }

  protected openProposal(path: string): void {
    var newWindow = this.nativeWindow.open(path);
  }

  private createAmbienceForm(ambience: Ambience): FormGroup {
    // let description = ambience.description ? ambience.description : '';
    let description =
      ambience.ambienceDescription !== undefined ? ambience.ambienceDescription : -1;
    let area = ambience.area ? ambience.area : '';
    let servicesIds: number[] =
      ambience.services ? ambience.services.map((service: Service) => { return service }) : [];

    return this.fb.group({
      description: [description],
      area: [area],
      services: [servicesIds]
    });
  }

  private createBankAccountForm(prof: Professional, bankAccount: BankAccount): FormGroup {
    let bankAccountId: string = 'new';
    let cpfCnpj: string = '';

    if (bankAccount && bankAccount.id !== undefined) {
      bankAccountId = String(bankAccount.id);
      // console.log();

    }

    if (prof.cpfCnpj && prof.cpfCnpj.length) {
      cpfCnpj = prof.cpfCnpj;
    }

    return this.fb.group({
      bankAccountId: [bankAccountId],
      bankId: [''],
      agencyNumber: [''],
      accountNumber: [''],
      accountDigit: [''],
      titular: [prof.name],
      accountCpfCnpj: [cpfCnpj],
      saveAccount: [true]
    });
  }

  private createClientForm(project: Project): FormGroup {
    let client = project.client;
    let clientId = '0';
    if (client && client.id && client.id.length) {
      clientId = client.id;
    }

    return this.clientForm = this.fb.group({
      clientId: [clientId, Validators.required],
      email: [''],
      cpfCnpj: [''],
      name: [''],
      clientGenderOpt: []
    });
  }

  private createDeliveryForm(delivery: Delivery): FormGroup {
    // let description =
    //   delivery.deliveryDescription !== undefined ? delivery.deliveryDescription : -1;
    let deadlineCount =
      delivery.duration !== undefined ? delivery.duration : '';
    let deadlineTimeUnity =
      delivery.durationTimeUnity !== undefined ? delivery.durationTimeUnity : -1;

    return this.fb.group({
      // description: [description],
      deadlineCount: [deadlineCount],
      deadlineTimeUnity: [deadlineTimeUnity]
    });

  }

  private createLocationForm(project: Project): FormGroup {
    return this.fb.group({
      briefing: [project.briefing],
      CEP: [project.CEP],
      addressArea: [project.addressArea],
      addressNumber: [project.addressNumber],
      city: [project.city],
      neighborhood: [project.neighborhood],
      UF: [project.UF]
    });

  }

  private createPartnersForm(ids: any[], currentProfId: string): FormGroup {
    let chipsData: any[] = [];
    if (ids && ids.length) {
      let index = ids.indexOf(currentProfId);
      if (index > -1) {
        ids.splice(index, 1)
      }

      chipsData = this.getPartnersByIds(ids).map((prof: any) => {
        prof.value = prof.id;
        prof.display = prof.name;
        return prof;
      });
    }

    return this.fb.group({
      partners: [chipsData]
    });
  }

  private createPaymentForm(costFinal: number): FormGroup {
    if (!costFinal) costFinal = 0

    return this.fb.group({
      cost: [costFinal],
    });
  }

  private createProfessionalForm(professional: Professional): FormGroup {
    let descriptionValue: string = '';

    if (professional.description != undefined && professional.description.length > 0)
      descriptionValue = professional.description;

    return this.fb.group({
      name: [{ value: professional.name, disabled: true }],
      description: [descriptionValue],
    });
  }

  private createProposalForm(project: Project): FormGroup {
    let duration = project.activeProposal.deadlineCount !== undefined ?
      project.activeProposal.deadlineCount : '';

    let durationTimeUnity = project.activeProposal.deadlineTimeUnity !== undefined ?
      project.activeProposal.deadlineTimeUnity : '';


    return this.fb.group({
      followUp: [project.activeProposal.followUp],
      duration: [duration],
      durationTimeUnity: [durationTimeUnity]
    });
  }

  private createSelectedDeliveriesForm(deliveriesIndexes: number[]): FormGroup {

    return this.fb.group({
      selectedDeliveries: [deliveriesIndexes]
    });
  }

  private findLocationByCEP(cepCode: string | number) {
    if (String(cepCode).length < 8) {
      return;
    }

    this.addressFieldsDisabled = true;

    cep(cepCode).then(CEP => {
      this.addressFieldsDisabled = false;
      this.locationForm.get('addressArea').setValue(CEP.street, { onlySelf: false, emitEvent: false });
      this.locationForm.get('city').setValue(CEP.city, { onlySelf: false, emitEvent: false });
      this.locationForm.get('neighborhood').setValue(CEP.neighborhood, { onlySelf: false, emitEvent: false });
      this.locationForm.get('UF').setValue(CEP.state, { onlySelf: false, emitEvent: false });


      Materialize.updateTextFields();

    }).catch(e => {
      console.log(e);
    });
  }

  private saveAmbiencesInfo(): Observable<boolean> {
    let someAmbienceWasChanged: boolean = false;

    this.ambiencesDataHasChanges.forEach((wasChanged: boolean, index) => {
      if (wasChanged) {

        // Verificar se o ambiente foi alterado ou removido 
        if (this.ambiencesForms[index] !== undefined) {
          let ambience: Ambience = new Ambience();
          ambience.ambienceDescription =
            AmbienceDescription[AmbienceDescription[this.ambiencesForms[index].value.description]];
          ambience.area = this.ambiencesForms[index].value.area;
          ambience.services = this.ambiencesForms[index].value.services;
          ambience.isActive = true;
          ambience.id = ProjectsService.ambienceDescriptionIds[ambience.ambienceDescription];

          let ambienceValid = (ambience.ambienceDescription in AmbienceDescription)
            && ambience.services.length > 0
            && ambience.area > 0;
          if (ambienceValid) {
            someAmbienceWasChanged = true;
            this.project.ambiences[index] = ambience;
          }

          this.ambiencesDataHasChanges[index] = false;
        } else {
          someAmbienceWasChanged = true;
          this.ambiencesDataHasChanges.splice(index, 1);
        }
      }

    });

    return Observable.of(someAmbienceWasChanged);
  }

  private saveBankAccountInfo(formData: any): Observable<BankAccount> {
    if (formData.bankAccountId === 'new' || formData.bankAccountId === 'undefined') {
      console.log(formData);

      let bankAccount: BankAccount;
      let bankAccountDataValid =
        Number(formData.bankId) !== NaN &&
        Number(formData.bankId) !== 0 &&
        formData.agencyNumber && String(formData.agencyNumber).replace(/\D/g, '').length > 3 &&
        formData.accountNumber && formData.accountNumber.replace(/\D/g, '').length > 4 &&
        formData.titular && formData.titular.length > 1 &&
        formData.accountDigit && formData.accountDigit.length > 0;

      // console.log('valid', bankAccountDataValid);

      if (bankAccountDataValid) {
        if (formData.accountCpfCnpj.replace(/\D/g, '').length !== 11 && formData.accountCpfCnpj.replace(/\D/g, '').length !== 14) {
          console.log('Cpf Cnpj inválid format', formData.accountCpfCnpj.replace(/\D/g, ''));

          return Observable.of(undefined);
        }
        console.log('valid data');

        bankAccount = new BankAccount(formData.agencyNumber, formData.accountNumber.trim(), formData.accountDigit);
        bankAccount.bank = this.allBanks.find(bank => bank.id === Number(formData.bankId))

        if (formData.saveAccount) {
          return this.bankAccService.addByProfessional(bankAccount, this.auth.getCurrentUser().id);
        }

        return Observable.of(bankAccount);

      } else {
        console.log('invalid data');
        return Observable.of(undefined);
      }
    } else {
      let bankAccount = this.bankAccounts
        .find(bankAccount => bankAccount.id == formData.bankAccountId)
      return Observable.of(bankAccount);
    }
  }

  private saveClientInfo(): Observable<any> {
    let selectedClientId = this.clientForm.value.clientId;
    let newClient: Client;

    if (String(selectedClientId) === '0') {
      newClient = new Client();
      newClient = {
        name: this.clientForm.value.name,
        email: this.clientForm.value.email,
        cpfCnpj: this.clientForm.value.cpfCnpj,
        gender: this.clientForm.value.clientGenderOpt
      };

      let newClientValid = Boolean(newClient.name)
        && newClient.name.length > 0
        && Boolean(newClient.email)
        && UtilsService.isEmail(newClient.email)
        && UtilsService.isCpfCnpj(newClient.cpfCnpj)
        && (newClient.gender === 'M'
          || newClient.gender === 'F');

      if (newClientValid
        && Boolean(newClient.cpfCnpj)
        && (newClient.cpfCnpj.length === 14
          || newClient.cpfCnpj.length === 18)) {
        return this.clientService
          .addByProfessional(newClient, this.professional.id);
      } else {
        return Observable.of(undefined);
      }
    } else {
      // Associate to an existing Client
      return this.clientService
        .getOne(selectedClientId);
    }
  }

  private saveDeliveriesInfo(): Observable<boolean> {
    let someDeliveryWasChanged: boolean = false;
    this.project.activeProposal.deliveries = [];

    this.selectedDeliveriesForm.value.selectedDeliveries.forEach(deliveryIndex => {
      let delivery: Delivery = new Delivery();

      delivery.deliveryDescription = DeliveryDescription[DeliveryDescription[deliveryIndex]];
      delivery.duration = this.deliveriesForms[deliveryIndex].value.deadlineCount;
      delivery.durationTimeUnity = this.deliveriesForms[deliveryIndex].value.deadlineTimeUnity;

      let deliveryValid = (delivery.deliveryDescription in DeliveryDescription)
        && delivery.duration
        && (delivery.durationTimeUnity in TimeUnity);

      if (deliveryValid) {
        someDeliveryWasChanged = true;
        this.project.activeProposal.deliveries[deliveryIndex] = delivery;
      }

      this.deliveryDataHasChanges[deliveryIndex] = false;
    });

    return Observable.of(true);
  }

  private saveLocationInfo(formData) {
    this.project.briefing = formData.briefing;
    this.project.CEP = formData.CEP;
    this.project.addressArea = formData.addressArea;
    this.project.addressNumber = formData.addressNumber;
    this.project.city = formData.city;
    this.project.neighborhood = formData.neighborhood;
    this.project.UF = formData.UF;
  }

  private saveProfessionalInfo(): Observable<any> {
    let description = this.profForm.value.description;
    let currentProf = this.professional;
    currentProf.name = name;
    currentProf.description = description;
    this.project.professional = currentProf;

    return this.profService.update(currentProf);
  }

  private saveProjectInfo(callback?: (success) => void, generateProposal?: boolean) {

    this.projectsService.update(this.project, generateProposal).subscribe((project: Project) => {
      console.log('Update result: ', project);

      this.project.activeProposal.cost = project.activeProposal.cost;
      this.project.activeProposal.url = project.activeProposal.url;

      if (callback !== undefined) {
        callback(true);
      }
    });

  }

  private saveProposalInfo(): Observable<any> {
    this.project.activeProposal.followUp = this.proposalForm.value.followUp;
    this.project.activeProposal.deadlineCount = this.proposalForm.value.duration;
    this.project.activeProposal.deadlineTimeUnity = this.proposalForm.value.durationTimeUnity;
    return Observable.of(true);
  }

  private subscribeToFormChanges(form: FormGroup, doIt: (data?) => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt(data)).debounceTime(3000).subscribe(data => callback(data));
  }
}
