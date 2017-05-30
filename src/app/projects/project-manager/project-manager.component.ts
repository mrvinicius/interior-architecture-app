import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdlExpansionPanelComponent } from '@angular-mdl/expansion-panel';
import { MzSelectDirective, MzModalService, MzToastService } from 'ng2-materialize';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';


import { Ambience } from '../shared/ambience';
import { AmbienceDescription } from '../shared/ambience-description.enum';
import { AmbienceService } from '../shared/ambience.service';
import { AuthService } from './../../core/auth.service';
import { Bank } from '../../billing/shared/bank';
import { BankService } from '../../billing/shared/bank.service';
import { BankAccountService } from './../../billing/shared/bank-account.service';
import { BankAccount } from '../../billing/shared/bank-account';
import { BillingModalComponent } from '../../billing/billing-modal/billing-modal.component';
import { BillingService } from './../../billing/shared/billing.service';
import { CanComponentDeactivate } from '../../core/can-deactivate-guard.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Delivery } from '../shared/delivery';
import { DeliveryDescription } from '../shared/delivery-description.enum';
import { NewPartnerModalComponent } from './new-partner-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Proposal } from './../shared/proposal';
import { ProposalService } from './../shared/proposal.service';
import { Service } from '../shared/service.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { TimeUnity } from '../../shared/time-unity.enum';
import { UF } from '../../shared/uf.enum';
import { UtilsService } from '../../shared/utils/utils.service';

@Component({
  selector: 'mbp-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements CanComponentDeactivate, OnInit, OnDestroy {
  // Refers to component global variables
  ambienceDescriptions: string[];
  ambienceSlug: string;
  deliveryDescriptions: string[];
  professional: Professional;
  professionalAddedSubscription: Subscription;
  project: Project;
  projectSlugTitle: string;
  services: string[];
  ufs: string[];
  mascaraReal = createNumberMask({
    prefix: 'R$',
    thousandsSeparatorSymbol: '.',
    decimalSymbol: ',',
    // allowLeadingZeroes: true,
    allowDecimal: true,
    // requireDecimal: true
  });
  allBanks: Bank[];
  bankAccounts: BankAccount[];

  // Refers to Client section variables
  clientDataHasChanged: boolean;
  clientDataBeingSaved: boolean;
  clientSaved: boolean = true;
  clientForm: FormGroup;
  clientFormChangesSubscription: Subscription;

  // Refers to Professional section variables
  profDataHasChanges: boolean;
  profDataBeingSaved: boolean;
  profForm: FormGroup;
  profFormChangesSubscription: Subscription;

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
    private activateRoute: ActivatedRoute,
    private ambienceService: AmbienceService,
    private auth: AuthService,
    private bankService: BankService,
    private bankAccService: BankAccountService,
    private billingService: BillingService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private toastService: MzToastService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private propService: ProposalService,
    private router: Router,
    private spinnerService: SpinnerService,
  ) {
    this.ufs = UtilsService.getEnumArray(UF);
    this.ambienceDescriptions = UtilsService.getEnumArray(AmbienceDescription);
    this.deliveryDescriptions = UtilsService.getEnumArray(DeliveryDescription);
    this.services = UtilsService.getEnumArray(Service);
    this.profService.getCurrentProfessional().subscribe(prof => this.professional = prof);

  }

  allClients(): Client[] {
    return this.clientService.allClients;
  }

  allProfessionals(): Professional[] {
    return this.profService.allProfessionals;
  }

  canDeactivate(): boolean {
    return !this.clientDataBeingSaved
      && !this.profDataBeingSaved
      && !this.proposalDataBeingSaved
      && !this.ambiencesDataBeingSaved
      && !this.paymentDataBeingSaved;
  }

  // deliveryAlreadySelected(deliveryDescIndex: number): boolean {
  //   return this.selectedDeliveries.includes(deliveryDescIndex);
  // }

  beginAmbience() {
    if (this.project.ambiences === undefined)
      this.project.ambiences = []

    let newLength = this.project.ambiences.push(new Ambience());
  }

  beginDelivery() {
    if (this.project.activeProposal.deliveries === undefined)
      this.project.activeProposal.deliveries = []

    let newLength = this.project.activeProposal.deliveries.push(new Delivery());
  }

  generateProposal() {
    this.spinnerService.toggleLoadingIndicator(true);
    this.saveProjectInfo((success) => {
      if (success) {
        window.open(this.project.activeProposal.url, '_blank');
        this.spinnerService.toggleLoadingIndicator(false);
      }
    }, true)
  }

  openBillingModal() {
    let modalRef = this.modalService.open(BillingModalComponent, {});
  }

  sendProposal() {
    this.spinnerService.toggleLoadingIndicator(true);
    console.log(this.profService.professional);
    
    if (!this.profService.professional.paying) {
      this.billingInfoUpdatedSubscription =
        this.billingService.billingInfoUpdated$
          .subscribe((success: boolean) => this.sendProposal());

      this.spinnerService.toggleLoadingIndicator(false);
      this.openBillingModal();

    } else {
      if (this.project.client && this.project.client.id) {
        this.saveProjectInfo((success) => {
          if (success) {
            this.propService.send(this.project).subscribe((success: boolean) => {
              if (success) {
                console.log(success);

                this.spinnerService.toggleLoadingIndicator(false);
                this.toastService.show('Projeto enviado!', 2500, 'green');
              }
            })
          }
        }, true)
      } else {
        this.spinnerService.toggleLoadingIndicator(false);
        this.toastService.show('Selecione um cliente', 2500, 'red');

      }
    }
  }

  getProjects(): Project[] {
    return this.projectsService.allProjects;
  }

  ngOnInit() {
    this.activateRoute.data
      .subscribe((data: { project: Project }) => {
        this.project = data.project;
        console.log(this.project);

        // this.project.activeProposal = 
        this.clientForm =
          this.createClientForm(data.project.briefing, data.project.client, this.project.uf);
        this.clientFormChangesSubscription = this.subscribeToFormChanges(this.clientForm, () => {
          this.clientDataHasChanged = true;
        }, (formData) => {
          if (!this.clientDataBeingSaved) {
            this.clientDataHasChanged = false;
            this.clientDataBeingSaved = true;
            this.saveClientInfo().subscribe(client => {
              if (client !== undefined) {
                this.project.client = client;
                this.clientForm.value.clientId = client.id;

                this.saveProjectInfo((success) => {
                  if (success) {
                    this.clientDataBeingSaved = false;
                  }
                });
              } else {
                this.clientDataBeingSaved = false;
              }
            });
          }
        });

        this.profForm =
          this.createProfessionalForm(this.professional, data.project.activeProposal.professionalsIds);
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
      });

    this.professionalAddedSubscription = this.profService.professionalAdded$
      .subscribe((newProfessional: Professional) => {
        // if  !this.project.partnersIds.length) this.project.partnersIds = []
        // this.project.partnersIds.push(newProfessional.id);
        this.profForm.value.partnersIds.push(newProfessional.id);
      });

    // let amb = new Ambience();
    // amb.ambienceDescription = AmbienceDescription.Suíte;
    // amb.services.push(Service['Layout de distribuição de móveis'])
    // this.project.ambiences.push(amb);
    // this.newAmbienceForm = this.createAmbienceForm(amb);
    // this.newAmbienceFormChangesSubscription = this.subscribeToNewAmbienceChanges();

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

    if (!this.professionalAddedSubscription.closed)
      this.professionalAddedSubscription.unsubscribe();
    // this.newAmbienceFormChangesSubscription.unsubscribe();

    if (this.billingInfoUpdatedSubscription &&
      !this.billingInfoUpdatedSubscription.closed) {

      this.billingInfoUpdatedSubscription.unsubscribe();
    }
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
        console.log(result);

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
    });;
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

  showDeliveryState() {
    // console.log(this.selectedDeliveries);
    console.log('subscriptions: ');
    this.deliveryFormsChangesSubscription.forEach(s => { if (!s.closed) console.log(s) })

    console.log('selected deliveries indexes: ', this.selectedDeliveriesForm.value.selectedDeliveries);

    this.deliveriesForms.forEach(form => {
      console.log(form.value);
    });

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

  private createClientForm(briefing: string, client: Client, uf: UF): FormGroup {
    let clientId = '0';
    if (client && client.id && client.id.length) {
      clientId = client.id;
    }

    return this.clientForm = this.fb.group({
      briefing: [briefing],
      ufId: [uf],
      clientId: [clientId, Validators.required],
      email: [''],
      cpfCnpj: [''],
      name: ['']
    });
  }

  private createSelectedDeliveriesForm(deliveriesIndexes: number[]): FormGroup {

    return this.fb.group({
      selectedDeliveries: [deliveriesIndexes]
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

  private createPaymentForm(costFinal: number): FormGroup {
    return this.fb.group({
      cost: [costFinal],
    });
  }

  private createProfessionalForm(professional: Professional, partnersIds: string[]): FormGroup {
    let descriptionValue: string = '';

    if (professional.description != undefined && professional.description.length > 0)
      descriptionValue = professional.description;

    return this.fb.group({
      name: [professional.name, Validators.required],
      partnersIds: [partnersIds],
      description: [descriptionValue],
    });
  }

  private createProposalForm(project: Project): FormGroup {
    let introValue = '';
    let duration = project.activeProposal.deadlineCount !== undefined ?
      project.activeProposal.deadlineCount : '';

    let durationTimeUnity = project.activeProposal.deadlineTimeUnity !== undefined ?
      project.activeProposal.deadlineTimeUnity : '';

    if (project.activeProposal.intro !== undefined)
      introValue = project.activeProposal.intro;

    return this.fb.group({
      proposalIntro: [introValue],
      duration: [duration],
      durationTimeUnity: [durationTimeUnity]
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
      let bankAccount: BankAccount;
      let bankAccountDataValid =
        // formData.bankId &&
        String(formData.agencyNumber).length > 2 &&
        formData.accountNumber.length > 3 &&
        formData.titular.length > 1 &&
        formData.accountCpfCnpj.length > 12 &&
        UtilsService.isCpfCnpj(formData.accountCpfCnpj);


      if (bankAccountDataValid) {
        bankAccount = new BankAccount(formData.agencyNumber, formData.accountNumber, formData.accountDigit);
        bankAccount.bank = this.allBanks.find(bank => bank.id === Number(formData.bankId))

        if (formData.saveAccount) {
          return this.bankAccService.addByProfessional(bankAccount, this.auth.getCurrentUser().id);
        }

        return Observable.of(bankAccount);

      } else {
        return Observable.of(undefined);
      }
    } else {
      let bankAccount = this.bankAccounts
        .find(bankAccount => bankAccount.id == formData.bankAccountId)
      return Observable.of(bankAccount);
    }
  }

  private saveClientInfo(): Observable<Client> {
    let briefing = this.clientForm.value.briefing;
    let ufId = this.clientForm.value.ufId;
    let selectedClientId = this.clientForm.value.clientId;
    let newClientName = this.clientForm.value.name;
    let newClientEmail = this.clientForm.value.email;
    let newClientCpfCnpj = this.clientForm.value.cpfCnpj;
    let newClient: Client;

    this.project.briefing = briefing;

    this.project.uf = ufId;
    // check newclient option selected
    if (String(selectedClientId) === '0') {
      newClient = new Client();
      newClient = {
        name: newClientName,
        email: newClientEmail,
        cpfCnpj: newClientCpfCnpj
      };

      let newClientValid = newClient.name && newClient.name.length > 0 &&
        newClient.email && UtilsService.isEmail(newClient.email) &&
        newClient.cpfCnpj && UtilsService.isCpfCnpj(newClient.cpfCnpj);

      if (newClientValid) {
        this.clientForm.reset();
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

      // console.log((delivery.deliveryDescription in DeliveryDescription));
      // console.log(delivery.duration?true:false);
      // console.log((delivery.durationTimeUnity in TimeUnity));

      if (deliveryValid) {
        someDeliveryWasChanged = true;
        this.project.activeProposal.deliveries[deliveryIndex] = delivery;

      }

      this.deliveryDataHasChanges[deliveryIndex] = false;


    });

    console.log('someDeliveryWasChanged: ', someDeliveryWasChanged);

    return Observable.of(true);

    // this.deliveryDataHasChanges.forEach((wasChanged: boolean, index) => {
    //   if (wasChanged) {
    //     if (this.deliveryForms[index] !== undefined) {
    //       let delivery: Delivery = new Delivery();
    //       delivery.deliveryDescription =
    //         DeliveryDescription[DeliveryDescription[this.deliveryForms[index].value.description]];
    //       delivery.deadlineCount = this.deliveryForms[index].value.deadlineCount;
    //       delivery.deadlineTimeUnity =
    //         TimeUnity[TimeUnity[this.deliveryForms[index].value.deadlineTimeUnity]];

    //       let deliveryValid = (delivery.deliveryDescription in DeliveryDescription)
    //         && delivery.deadlineCount
    //         && (delivery.deadlineTimeUnity in TimeUnity);

    //       if (deliveryValid) {

    //         someDeliveryWasChanged = true;
    //         this.project.activeProposal.deliveries[index] = delivery;
    //       }

    //       this.deliveryDataHasChanges[index] = false
    //     } else {
    //       someDeliveryWasChanged = true;

    //       this.deliveryDataHasChanges.splice(index, 1);
    //     }
    //   }
    // })

  }

  private saveProfessionalInfo(): Observable<any> {
    let name;
    let description;
    let partnersIds;
    let currentProf;

    name = this.profForm.value.name;
    description = this.profForm.value.description;
    partnersIds = this.profForm.value.partnersIds;
    currentProf = this.professional;
    currentProf.name = name;
    currentProf.description = description;
    this.project.activeProposal.professionalsIds = partnersIds;
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

  showAccountState() {
    console.log('active proposal:', this.project.activeProposal);
    console.log(this.bankAccountForm.value);
    // this.paymentForm.value.cost = '30';
  }

  private saveProposalInfo(): Observable<any> {
    this.project.activeProposal.intro = this.proposalForm.value.proposalIntro;
    this.project.activeProposal.deadlineCount = this.proposalForm.value.duration;
    this.project.activeProposal.deadlineTimeUnity = this.proposalForm.value.durationTimeUnity;
    return Observable.of(true);
  }

  private subscribeToFormChanges(form: FormGroup, doIt: (data?) => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt(data)).debounceTime(3000).subscribe(data => callback(data));
  }
}
