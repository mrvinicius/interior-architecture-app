import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdlExpansionPanelComponent } from '@angular-mdl/expansion-panel';
import { MzSelectDirective, MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';

import { UtilsService } from '../../shared/utils/utils.service';
import { NewPartnerModalComponent } from './new-partner-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { ProjectServicesService } from '../shared/project-services.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Ambience } from '../shared/ambience';
import { AmbienceService } from '../shared/ambience.service';
import { Service } from '../shared/service';
import { ServiceType } from '../shared/service-type';
import { Estado } from '../../shared/estado.enum';

@Component({
  selector: 'mbp-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  project: Project;
  estados: string[];

  clientForm: FormGroup;
  clientFormUnsaved: boolean = false;
  clientFormChangesSubscription: Subscription;

  profForm: FormGroup;
  profFormUnsaved: boolean = false;
  profFormChangesSubscription: Subscription;

  proposalForm: FormGroup;
  proposalFormUnsaved: boolean = false;
  proposalFormChangesSubscription: Subscription;

  @ViewChild('newAmbiencePanel') newAmbiencePanel: MdlExpansionPanelComponent;
  newAmbienceForm: FormGroup = undefined;

  @ViewChild('newServicePanel') newServicePanel: MdlExpansionPanelComponent;
  newServiceDescription: string;
  newServiceForm: FormGroup = undefined;
  newServiceUnsaved: boolean = false; // track if is there new service unsaved 
  servicesForms: FormGroup[];

  constructor(
    private activateRoute: ActivatedRoute,
    private ambienceService: AmbienceService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private projectServService: ProjectServicesService,
    private router: Router
  ) {
    this.estados = UtilsService.estados;
  }

  get professional(): Professional {
    return this.profService.professional;
  }

  addService() {
    // add to local services
    // send throw API

    this.newServiceForm = undefined;
  }

  accordionChanged(tabIndex) {
    switch (tabIndex) {
      // Client tab change
      case 0:
        this.saveClientInfo();
        break;
      // Professional tab change
      case 1:
        this.saveProfessionalInfo();
        break;
      // Proposal details tab change
      case 2:
        // Prop intro sync
        // Check services changes
        this.saveProposalInfo();
        break;
      case 3:
        break;
    }
  }

  allClients(): Client[] {
    return this.clientService.allClients;
  }

  getProjects(): Project[] {
    return this.projectsService.allProjects;
  }

  allProfessionals(): Professional[] {
    return this.profService.allProfessionals;
  }

  beginAmbience() {
    this.router.navigate(['/projetos/ambiente/novo']);

    // this.ambienceService.

    // this.projectsService.add(title).subscribe((project: Project) => {
    //   // this.redirectToProject(project.id); // TODO: Resolver problema de adição de projetos 
    // });
  }

  getServiceTypeDescription(id: string): string {
    let sType = this.getServiceTypes().find((sType: ServiceType) => {
      return sType.id === id;
    });

    return sType.typeDescription;
  }

  getServiceTypes(): ServiceType[] {
    return this.projectServService.serviceTypes;
  }

  ngOnInit() {
    this.activateRoute.data
      .subscribe((data: { project: Project }) => {
        console.log(data.project);

        this.project = data.project;
        this.clientForm =
          this.createClientForm(data.project.briefing, data.project.client, this.project.activeProposal.uf);
        this.clientFormChangesSubscription = this.subscribeToClientChanges();

        this.profForm =
          this.createProfessionalForm(this.professional, data.project.activeProposal.professionalsIds);
        this.profFormChangesSubscription = this.subscribeToProfessionalChanges();
      });


    this.proposalForm = this.createProposalForm(this.project);
    this.proposalFormChangesSubscription = this.subscribeToProposalChanges();
    // this.servicesForms = this.createServicesForms(this.project.services);

    this.profService.professionalAdded$.subscribe((newProfessional: Professional) => {
      // if  !this.project.partnersIds.length) this.project.partnersIds = []
      // this.project.partnersIds.push(newProfessional.id);
      this.profForm.value.partnersIds.push(newProfessional.id);
    });

    let s = new Service();
    s.serviceType = new ServiceType();
    this.newServiceForm = this.createServiceForm(s);
  }

  ngOnDestroy() {
    this.clientFormChangesSubscription.unsubscribe();
    this.profFormChangesSubscription.unsubscribe();
  } // TODO: Check destroy necessity

  openNewPartnerModal() {
    let modalRef = this.modalService.open(NewPartnerModalComponent, {});
  }

  /* Atualiza os Clientes relacionados ao Usuário e o Cliente da Proposta */
  saveClientInfo() {
    if (this.clientFormUnsaved) {
      let briefing = this.clientForm.value.briefing;
      let estado = this.clientForm.value.estado;
      let selectedClientId = this.clientForm.value.clientId;
      let newClientName = this.clientForm.value.name;
      let newClientEmail = this.clientForm.value.email;
      let newClientCpfCnpj = this.clientForm.value.cpfCnpj;

      this.project.briefing = briefing;
      this.project.activeProposal.uf = estado;
      // check newclient option selected
      if (String(selectedClientId) === '0') {
        let newClient: Client = new Client();
        newClient = {
          name: newClientName,
          email: newClientEmail,
          cpfCnpj: newClientCpfCnpj
        };

        let newClientValid = newClient.name && newClient.name.length > 0 &&
          newClient.email && UtilsService.isEmail(newClient.email) &&
          newClient.cpfCnpj && UtilsService.isCpfCnpj(newClient.cpfCnpj);

        if (newClientValid) {
          this.clientService
            .addByProfessional(newClient, this.professional.id)
            .subscribe((newClient: Client) => {
              this.project.client = newClient;
              this.clientForm.value.clientId = newClient.id;
            });
        }
        this.profService.addClients(newClient);
      } else {
        // Update to an existing Client
        this.clientService
          .getOne(selectedClientId).subscribe(client => this.project.client = client);
      }

      // Update project
      this.projectsService.update(this.project).subscribe();
      this.clientFormUnsaved = false;
    }
  }

  /* Atualiza as informações Profissionais no Usuário e na Proposta */
  saveProfessionalInfo() {
    let name = this.profForm.value.name;
    let description = this.profForm.value.description;
    let partnersIds = this.profForm.value.partnersIds;

    if (this.profFormUnsaved) {
      let currentProf = this.professional;
      currentProf.name = name;
      currentProf.description = description;

      this.project.activeProposal.professionalsIds = partnersIds;
      this.project.professional = currentProf;

      this.projectsService.update(this.project).subscribe(response => {
        console.log(response);
      });

      this.profService.update(currentProf).subscribe(response => {
        console.log(response);
      });

      this.profFormUnsaved = false;

    }
  }

  saveProposalInfo() { }

  showNewAmbiencePanel() {
    let ambience: Ambience;
    this.newAmbiencePanel.expand();

    if (this.newAmbienceForm !== undefined) {
      // Já existe um novo ambiente não salvo ainda
      return;
    } else {
      ambience = new Ambience();
      this.newAmbienceForm = this.createAmbienceForm(ambience);

    }
  }

  showNewServicePanel() {
    let service: Service;

    if (this.newServiceUnsaved || this.newServiceForm !== undefined) {
      return;
    } else {
      service = new Service();

      this.newServiceUnsaved = true;
      this.newServicePanel.expand();
      // this.newServiceForm = this.createServiceForm();
      // check another new service
      // push projeto
      // build form
      // add DOM

    }
  }

  private createClientForm(briefing: string, client: Client, uf: Estado): FormGroup {
    let clientId: string = client.id !== undefined && client.id !== null ? client.id : '0';

    return this.clientForm = this.fb.group({
      briefing: [briefing],
      estado: [uf],
      clientId: [clientId, Validators.required],
      email: [''],
      cpfCnpj: [''],
      name: ['']
    });
  }

  private createAmbienceForm(ambience: Ambience): FormGroup {
    return this.fb.group({
      ambienceTypeId: [null, []],
      ambienceArea: [0, []],
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
    return this.fb.group({
      proposalIntro: [] // TODO: Last created and Active Proposal
    });
  }

  private createServiceForm(service: Service): FormGroup {
    let serviceType: ServiceType =
      service.serviceType !== undefined ? service.serviceType : new ServiceType();
    let typeDescription: string =
      service.serviceType.typeDescription !== undefined ? service.serviceType.typeDescription : '';

    return this.fb.group({
      serviceTypeId: [],
      serviceDesc: []
    });
  }

  private createServicesForms(services: Service[]): FormGroup[] {
    let servicesFormGroups: FormGroup[] = [];

    services.forEach((service: Service, index, array) => {
      let formGroup = this.fb.group({
        serviceTypeId: [service.serviceType.id],
        serviceDesc: [service.description]
      });

      servicesFormGroups.push(formGroup);
    });

    return servicesFormGroups;
  }

  private redirectToAmbience(id?: string, title?: string): void {
    this.router.navigate(['/projetos', id]);
  }

  private subscribeToClientChanges() {
    const clientFormChanges$ = this.clientForm.valueChanges;

    return clientFormChanges$
      .subscribe(data => {
        this.clientFormUnsaved = true;
      })
  }

  private subscribeToProfessionalChanges() {
    const profFormChanges$ = this.profForm.valueChanges;

    return profFormChanges$
      .subscribe(data => {
        this.profFormUnsaved = true;
      })
  }

  private subscribeToProposalChanges() {
    const proposalFormChanges$ = this.proposalForm.valueChanges;

    return proposalFormChanges$
      .subscribe(data => {
        this.proposalFormUnsaved = true;
      });

    // Listen to service panels changes
  }
}
