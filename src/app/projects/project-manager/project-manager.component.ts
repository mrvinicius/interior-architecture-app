import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdlExpansionPanelComponent } from '@angular-mdl/expansion-panel';
import { MzSelectDirective, MzModalService } from 'ng2-materialize';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


import { Ambience } from '../shared/ambience';
import { AmbienceDescription } from '../shared/ambience-description.enum';
import { AmbienceService } from '../shared/ambience.service';
import { Bank } from '../../financial/shared/bank';
import { BankService } from '../../financial/shared/bank.service';
import { BankAccountService } from './../../financial/shared/bank-account.service';
import { BankAccount } from '../../financial/shared/bank-account';
import { CanComponentDeactivate } from '../../core/can-deactivate-guard.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { NewPartnerModalComponent } from './new-partner-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Proposal } from './../shared/proposal';
import { Service } from '../shared/service.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';
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
  professionalAddedSubscription: Subscription;
  project: Project;
  projectSlugTitle: string;
  services: string[];
  ufs: string[];
  mascaraReal = createNumberMask({
    prefix: '',
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
  clientDataSaved$: Subject<boolean> = new Subject<boolean>();
  clientSaved: boolean = true;
  clientForm: FormGroup;
  clientFormChangesSubscription: Subscription;

  // Refers to Professional section variables
  profDataHasChanges: boolean;
  profDataBeingSaved: boolean;
  profDataSaved$: Subject<boolean> = new Subject<boolean>();
  profForm: FormGroup;
  profFormChangesSubscription: Subscription;

  // Refers to Proposal section variables
  proposalDataHasChanges: boolean;
  proposalDataBeingSaved: boolean;
  proposalDataSaved$: Subject<boolean> = new Subject<boolean>();
  proposalForm: FormGroup;
  proposalFormChangesSubscription: Subscription;

  ambiencesDataHasChanges: boolean[] = [];
  ambiencesDataBeingSaved: boolean;
  ambiencesDataSaved$: Subject<boolean> = new Subject<boolean>();
  ambiencesForms: FormGroup[] = [];
  ambiencesFormsChangesSubscription: Subscription[] = [];

  // Refers to Payment section variables
  paymentDataHasChanges: boolean;
  paymentDataBeingSaved: boolean;
  paymentDataSaved$: Subject<boolean> = new Subject<boolean>();
  paymentForm: FormGroup;
  paymentFormChangesSubscription: Subscription;

  bankAccountDataHasChanges: boolean;
  bankAccountDataBeingSaved: boolean;
  bankAccountForm: FormGroup;
  bankAccountFormChangesSubscription: Subscription;

  constructor(
    private activateRoute: ActivatedRoute,
    private ambienceService: AmbienceService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private router: Router,
    private spinnerService: SpinnerService,
    private bankService: BankService,
    private bankAccService: BankAccountService
  ) {
    this.ufs = UtilsService.getEnumArray(UF);
    this.ambienceDescriptions = UtilsService.getEnumArray(AmbienceDescription);
    this.services = UtilsService.getEnumArray(Service);
  }

  get professional(): Professional {
    return this.profService.professional;
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

  beginAmbience() {
    if (this.project.ambiences === undefined)
      this.project.ambiences = []

    let newLength = this.project.ambiences.push(new Ambience());
    // this.ambiencesDataHasChanges[newLength - 1] = true;

    // let amb = new Ambience();

    // this.ambiencesForms[this.project.ambiences.length] =
    //   this.createAmbienceForm(amb);

    // this.project.ambiences[this.project.ambiences.length] = amb;
  }

  showState() {
    // console.log('Forms:', this.ambiencesForms.value);
    if (this.ambiencesForms)
      this.ambiencesForms.forEach((val, index) => console.log('Form ' + index, val.value));

    console.log('ambiences:', this.project.ambiences);
    console.log(this.ambiencesDataHasChanges);
  }

  getProjects(): Project[] {
    return this.projectsService.allProjects;
  }

  ngOnInit() {
    this.activateRoute.data
      .subscribe((data: { project: Project }) => {
        console.log(data.project);

        this.project = data.project;
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

        this.paymentForm = this.createPaymentForm(this.project.activeProposal.cost, this.project.activeProposal.costFinal);

        const costValueChanges$ = this.paymentForm.get('cost').valueChanges;
        costValueChanges$.debounceTime(1000).subscribe((value: string) => {
          value = value.replace(/[.]/g, '')
            .replace(/[,]/g, '.');
          let changedValue = parseFloat(value);
          console.log(this.project.activeProposal.cost, changedValue);

          let highest = Math.max(changedValue, this.project.activeProposal.cost)
          let lower = Math.min(changedValue, this.project.activeProposal.cost)

          let valueDifference = highest % lower;
          if (valueDifference === NaN) valueDifference = 0;

          this.project.activeProposal.cost = valueDifference > 2 ? changedValue : undefined;

          this.saveProjectInfo((success) => {

          });
        });

        const paymentOptChanges$ = this.paymentForm.get('paymentOpt').valueChanges;
        paymentOptChanges$.debounceTime(1000).subscribe((option: any) => {
          option = Number(option);
          this.paymentDataHasChanges = false;
          this.paymentDataBeingSaved = true;

          if (option === 1) {
            this.project.activeProposal.costFinal = this.project.activeProposal.cost;
          } else if (option === 2) {
            this.project.activeProposal.costFinal = this.project.activeProposal.costToClient;
          }

          if (option === 1 || option === 2) {
            this.saveProjectInfo((success) => {
              if (success) {
                this.paymentDataBeingSaved = false;
              }
            });
          }
        });

        // this.paymentFormChangesSubscription = this.subscribeToFormChanges(this.paymentForm, () => {
        //   this.paymentDataHasChanges = true;
        // }, (formData) => {
        //   if (!this.paymentDataBeingSaved) {
        //     this.paymentDataHasChanges = false;
        //     this.paymentDataBeingSaved = true;
        //     this.savePaymentInfo(formData).subscribe(result => {
        //       if (result !== undefined) {
        //         if (!result) {
        //           this.paymentDataBeingSaved = false;
        //         } else {
        //           this.saveProjectInfo((success) => {
        //             if (success) {
        //               this.paymentDataBeingSaved = false;
        //             }
        //           });
        //         }
        //       }
        //     });
        //   }
        // });

        this.bankService.getAll().subscribe(banks => {
          this.allBanks = banks
        });
        this.bankAccService.getAllByProfessional(this.professional.id)
          .subscribe(bankAccs => {
            this.bankAccounts = bankAccs ? bankAccs : []
          });

        this.bankAccountForm = this.createBankAccountForm(this.professional, this.project.activeProposal.bankAccount);
        this.bankAccountFormChangesSubscription = this.subscribeToFormChanges(this.bankAccountForm, () => {
          this.bankAccountDataHasChanges = true;
        }, (formData) => {
          if (!this.bankAccountDataBeingSaved) {
            this.bankAccountDataHasChanges = false;
            this.bankAccountDataBeingSaved = true;
            this.saveBankAccountInfo(formData).subscribe((bankAcc: BankAccount) => {
              console.log(bankAcc);

              if (bankAcc !== undefined) {
                this.bankAccounts.push(bankAcc);
                this.project.activeProposal.bankAccount = bankAcc;
                this.saveProjectInfo((success) => {
                  if (success) {
                    this.bankAccountForm.reset();
                    this.bankAccountForm.value.bankAccountId = bankAcc.id;
                    this.bankAccountDataBeingSaved = false;
                  }
                });
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
  }

  openNewPartnerModal() {
    let modalRef = this.modalService.open(NewPartnerModalComponent, {});
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

  private createAmbienceForm(ambience: Ambience): FormGroup {
    // let description = ambience.description ? ambience.description : '';
    let description = ambience.ambienceDescription !== undefined ? ambience.ambienceDescription : -1;
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

  private createPaymentForm(cost: number, costFinal: number): FormGroup {
    let paymentOpId: number = 0;
    // console.log(Math.round(costFinal), Math.round(this.project.activeProposal.cost));
    // console.log(Math.round(costFinal), Math.round(this.project.activeProposal.costToClient));
    
    if (Math.round(costFinal) === Math.round(this.project.activeProposal.cost))
      paymentOpId = 1
    if (Math.round(costFinal) === Math.round(this.project.activeProposal.costToClient))
      paymentOpId = 2

    return this.fb.group({
      cost: [Math.round(cost)],
      paymentOpt: [paymentOpId]
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

    if (project.activeProposal.intro !== undefined)
      introValue = project.activeProposal.intro;


    return this.fb.group({
      proposalIntro: [introValue]
    });
  }

  private createBankAccountForm(prof: Professional, bankAccount: BankAccount): FormGroup {
    let bankAccountId: string = 'new';
    let cpfCnpj: string = '';

    if (bankAccount && bankAccount.id && bankAccount.id.length) {
      bankAccountId = bankAccount.id;
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

  private saveBankAccountInfo(formData: any): Observable<BankAccount> {
    console.log(formData);

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
          return this.bankAccService.addByProfessional(bankAccount, this.professional.id);
        }

        return Observable.of(bankAccount);


      } else {
        return Observable.of(undefined);
      }
    } else {
      return this.bankAccService.getOne(formData.bankAccountId);
    }

    // this.project.briefing = briefing;

    // this.project.uf = ufId;
    // // check newclient option selected
    // if (String(selectedClientId) === '0') {
    //   newClient = new Client();
    //   newClient = {
    //     name: newClientName,
    //     email: newClientEmail,
    //     cpfCnpj: newClientCpfCnpj
    //   };

    //   let newClientValid = newClient.name && newClient.name.length > 0 &&
    //     newClient.email && UtilsService.isEmail(newClient.email) &&
    //     newClient.cpfCnpj && UtilsService.isCpfCnpj(newClient.cpfCnpj);

    //   if (newClientValid) {
    //     this.clientForm.reset();
    //     return this.clientService
    //       .addByProfessional(newClient, this.professional.id);
    //   } else {
    //     return Observable.of(undefined);
    //   }
    // } else {
    //   // Associate to an existing Client
    //   return this.clientService
    //     .getOne(selectedClientId);
    // }
    // return Observable.of(undefined);
  }

  /* Atualiza os Clientes relacionados ao Usuário e o Cliente da Proposta */
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

  private savePaymentInfo(formData: any): Observable<boolean> {
    if (formData.paymentOpt == 1) {
      this.project.activeProposal.costFinal = this.project.activeProposal.cost;
    } else if (formData.paymentOpt == 2) {
      this.project.activeProposal.costFinal = this.project.activeProposal.costToClient;
    } else {
      return Observable.of(false);
    }

    return Observable.of(true);
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

  private saveProjectInfo(callback?: (success) => void) {
    this.projectsService.update(this.project).subscribe((project: Project) => {
      console.log('Update result: ', project);

      this.project.activeProposal.cost = project.activeProposal.cost;
      this.project.activeProposal.costToClient = project.activeProposal.costToClient;
      this.project.activeProposal.costToReceive = project.activeProposal.costToReceive;
      if (callback !== undefined) {
        callback(true);
      }
    });

  }

  private saveProposalInfo(): Observable<any> {
    this.project.activeProposal.intro = this.proposalForm.value.proposalIntro;
    return Observable.of(true);
  }

  private saveAmbiencesInfo(): Observable<boolean> {
    let someAmbienceWasChanged: boolean = false;

    this.ambiencesDataHasChanges.forEach((wasChanged: boolean, index) => {
      if (wasChanged) {

        // Verificar se o ambiente foi alterado ou removido 
        if (this.ambiencesForms[index] !== undefined) {
          let ambience: Ambience = new Ambience();
          ambience.ambienceDescription = AmbienceDescription[AmbienceDescription[this.ambiencesForms[index].value.description]]
          ambience.area = this.ambiencesForms[index].value.area
          ambience.services = this.ambiencesForms[index].value.services
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

        // Reset form changes detection
      }

    });

    return Observable.of(someAmbienceWasChanged);
  }

  private subscribeToFormChanges(form: FormGroup, doIt: () => void, callback?: (data) => void): Subscription {
    const formChanges$ = form.valueChanges;

    return formChanges$.do(data => doIt()).debounceTime(3000).subscribe(data => callback(data));
  }
}
