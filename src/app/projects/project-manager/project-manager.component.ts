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
// import { Service } from '../shared/service';
import { Estado } from '../../shared/estado.enum';
import { SpinnerService } from '../../core/spinner/spinner.service';

@Component({
  selector: 'mbp-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  project: Project;
  projectSlugTitle: string;
  ambienceSlug: string;
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

  ambiencesForms: FormGroup[] = [];
  newAmbienceForm: FormGroup;
  newAmbienceFormUnsaved: boolean = false;
  newAmbienceFormChangesSubscription: Subscription;

  // @ViewChild('newAmbiencePanel') newAmbiencePanel: MdlExpansionPanelComponent;
  // newAmbienceForm: FormGroup = undefined;

  // @ViewChild('newServicePanel') newServicePanel: MdlExpansionPanelComponent;
  // newServiceDescription: string;
  // newServiceForm: FormGroup = undefined;
  // newServiceUnsaved: boolean = false; // track if is there new service unsaved 
  // servicesForms: FormGroup[];

  constructor(
    private activateRoute: ActivatedRoute,
    private ambienceService: AmbienceService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
    private projectServService: ProjectServicesService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.estados = UtilsService.estados;
  }

  get professional(): Professional {
    return this.profService.professional;
  }

  addService() {
    // add to local services
    // send throw API

    // this.newServiceForm = undefined;
  }

  accordionChanged(tabIndex) {
    switch (tabIndex) {
      case 0:
        this.saveClientInfo();
        break;
      case 1:
        this.saveProfessionalInfo();
        break;
      case 2:
        this.saveProposalInfo();
        break;
      case 3:
        break;
    }
  }

  allClients(): Client[] {
    return this.clientService.allClients;
  }




  // checkNewAmbienceForm(): boolean {
  //   let ambienceDesc = this.newAmbienceForm.value.description;
  //   let area = this.newAmbienceForm.value.area;
  //   let

  //   return true;
  // }

  // beginNewAmbience() {
  //   console.log('new ambience begun');

  // }

  // showNewAmbienceFormInvalidAlert() {
  //   console.log('showNewAmbienceFormInvalidAlert');

  // }

  beginAmbience() {
    if (this.project.ambiences === undefined)
      this.project.ambiences = []

    let amb = new Ambience();

    this.ambiencesForms[this.project.ambiences.length] =
      this.createAmbienceForm(amb);

    this.project.ambiences[this.project.ambiences.length] = amb;
  }

  removeAmbience(ambienceIndex: number) {
    // Update project
    this.ambiencesForms.splice(ambienceIndex, 1);
    this.project.ambiences.splice(ambienceIndex, 1);
  }

  setAmbienceForm(ambienceIndex: number) {
    if (this.ambiencesForms[ambienceIndex] === undefined)
      this.ambiencesForms[ambienceIndex] = this.createAmbienceForm(this.project.ambiences[ambienceIndex]);

    return true;
  }

  // getAmbienceForm(ambienceIndex: number): string {
  //   this.ambiencesForms[ambienceIndex] = this.createAmbienceForm(this.project.ambiences[ambienceIndex]);
  //   return 'ambiencesForms['+ambienceIndex+']';
  // }

  private createAmbienceForm(ambience: Ambience): FormGroup {
    let description = ambience.description ? ambience.description : '';
    let area = ambience.area ? ambience.area : 0;
    let servicesIds: string[] =
      ambience.services ? ambience.services.map(service => { return service.id }) : [];

    return this.fb.group({
      description: [description],
      area: [area],
      services: [servicesIds]
    });
  }





  getProjects(): Project[] {
    return this.projectsService.allProjects;
  }

  allProfessionals(): Professional[] {
    return this.profService.allProfessionals;
  }

  // beginAmbience(projectId) {
  //   console.log(projectId);


  //   this.spinnerService.toggleLoadingIndicator(true);
  //   this.ambienceService.add(projectId).subscribe((ambience: Ambience) => {
  //     this.project.ambiences.push(ambience);
  //     this.projectsService.update(this.project).subscribe(response => {
  //       console.log(response);

  //       this.spinnerService.toggleLoadingIndicator(false);

  //       let ambienceSlugTitle = UtilsService.slugify(ambience.description);
  //       this.router.navigate(['/projetos/' + this.projectSlugTitle], ambienceSlugTitle);
  //     });
  //   });

  //   // this.ambienceService.

  //   // this.projectsService.add(title).subscribe((project: Project) => {
  //   //   // this.redirectToProject(project.id); // TODO: Resolver problema de adição de projetos 
  //   // });
  // }

  ngOnInit() {
    this.activateRoute.data
      .subscribe((data: { project: Project }) => {
        console.log(data.project);

        this.project = data.project;
        this.projectSlugTitle = UtilsService.slugify(this.project.title);
        this.ambienceSlug = '/projetos/' + this.projectSlugTitle;

        this.clientForm =
          this.createClientForm(data.project.briefing, data.project.client, this.project.activeProposal.uf);
        this.clientFormChangesSubscription = this.subscribeToClientChanges();

        this.profForm =
          this.createProfessionalForm(this.professional, data.project.activeProposal.professionalsIds);
        this.profFormChangesSubscription = this.subscribeToProfessionalChanges();

        this.proposalForm = this.createProposalForm(this.project);
        this.proposalFormChangesSubscription = this.subscribeToProposalChanges();
      });

    this.profService.professionalAdded$.subscribe((newProfessional: Professional) => {
      // if  !this.project.partnersIds.length) this.project.partnersIds = []
      // this.project.partnersIds.push(newProfessional.id);
      this.profForm.value.partnersIds.push(newProfessional.id);
    });

    this.newAmbienceForm = this.createAmbienceForm(new Ambience());
    this.newAmbienceFormChangesSubscription = this.subscribeToNewAmbienceChanges();

  }

  ngOnDestroy() {
    this.clientFormChangesSubscription.unsubscribe();
    this.profFormChangesSubscription.unsubscribe();
    this.proposalFormChangesSubscription.unsubscribe();
    this.newAmbienceFormChangesSubscription.unsubscribe();
  }

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
    let name;
    let description;
    let partnersIds;
    let currentProf;

    if (this.profFormUnsaved) {
      name = this.profForm.value.name;
      description = this.profForm.value.description;
      partnersIds = this.profForm.value.partnersIds;
      currentProf = this.professional;
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

  saveProposalInfo() {
    let intro;

    if (this.newAmbienceFormUnsaved) {

    }

    if (this.proposalFormUnsaved) {
      intro = this.proposalForm.value.proposalIntro;
      this.project.activeProposal.intro = intro;

      this.projectsService.update(this.project)
        .subscribe(response => {
          console.log(response)
          this.proposalFormUnsaved = false;
        });
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

  private subscribeToNewAmbienceChanges() {
    const newAmbienceFormChanges$ = this.newAmbienceForm.valueChanges;

    return newAmbienceFormChanges$
      .subscribe(data => {
        this.newAmbienceFormUnsaved = true;
      });
  }
}
