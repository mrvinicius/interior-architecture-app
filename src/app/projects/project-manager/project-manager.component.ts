import { UtilsService } from './../../shared/utils/utils.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MzSelectDirective, MzModalService } from 'ng2-materialize';
import 'rxjs/add/operator/distinctUntilChanged';

import { NewPartnerModalComponent } from './new-partner-modal.component';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Project } from '../shared/project';
import { ProjectsService } from '../shared/projects.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';

@Component({
  selector: 'mbp-project-manager',
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  clientFormUnsaved: boolean = false;
  // professionals: Professional[] = [];
  // clients: Client[] = [];
  profForm: FormGroup;
  profFormUnsaved: boolean = false;
  project: Project;
  // private _professional: Professional;

  constructor(
    private activateRoute: ActivatedRoute,
    private clientService: ClientService,
    private fb: FormBuilder,
    private modalService: MzModalService,
    private profService: ProfessionalService,
    private projectsService: ProjectsService,
  ) {

    this.project = new Project();
    this.project.client = new Client();
    this.project.partnersIds = []; // TODO: corrigir e sincronizar com os valores desse projeto/proposta



    // this._professional = this.profService.professional;
    // this.projectsService.newProjectTitleDefined$.subscribe(projectTitle => this.initProject(projectTitle));

    // this.clientService.allClientsChange$.subscribe(allClients => {
    //   this.clients = allClients;
    // });

    // this.profService.allProfessionalsChange$.subscribe(allProfessionals => {
    //   this.professionals = allProfessionals;
    // });

  }

  get allClients(): Client[] {
    return this.clientService.allClients;
  }

  get allProfessionals(): Professional[] {
    return this.profService.allProfessionals;
  }

  set professional(prof: Professional) {
    // this._professional = prof;
  }

  get professional(): Professional {
    return this.profService.professional;
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
        break;
      case 3:
        break;
    }
  }

  ngOnDestroy() {
    // this.profService.professionalChange$.unsubscribe();
    // this.clientService.allClientsChange$.unsubscribe();
    // this.profService.allProfessionalsChange$.unsubscribe();
  }

  ngOnInit() {
    this.activateRoute.params
      .switchMap((params: Params) => this.projectsService.getProject(params['id']))
      .subscribe(project => this.project = project);


    this.createClientForm();
    this.subscribeToClientChanges();
    // console.log(this.profService.professional)
    this.profForm = this.createProfessionalForm(this.professional);
    this.subscribeToProfessionalChanges();

    this.profService.professionalAdded$.subscribe((newProfessional: Professional) => {
      // if  !this.project.partnersIds.length) this.project.partnersIds = []

      // this.project.partnersIds.push(newProfessional.id);
      this.profForm.value.partnersIds.push(newProfessional.id);
    });
  }

  openNewPartnerModal() {
    let modalRef = this.modalService.open(NewPartnerModalComponent, {});
  }

  /**
   * Atualiza os Clientes relacionados ao Usuário e o Cliente da Proposta
   */
  saveClientInfo() {
    let form = this.clientForm;

    if (this.clientFormUnsaved) {

      // check newclient option selected
      if (String(this.clientForm.value.clientId) === '0') {
        let newClient: Client = new Client();
        newClient = {
          name: form.value.name,
          email: form.value.email,
          cpfCnpj: form.value.cpfCnpj
        };

        let newClientValid = newClient.name && newClient.name.length > 0 &&
          newClient.email && UtilsService.isEmail(newClient.email) &&
          newClient.cpfCnpj && UtilsService.isCpfCnpj(newClient.cpfCnpj);

        if (newClientValid) {
          this.clientService
            .addByProfessional(newClient, this.professional.id)
            .subscribe((newClient: Client) => {
              this.project.client.id = newClient.id;
              this.clientForm.value.clientId = newClient.id;
            }); // TODO: Faça alguma coisa
        }
        this.profService.addClients(newClient);
      }

      this.clientFormUnsaved = false;
    }
  }

  /**
   * Atualiza as informações Profissionais no Usuário e na Proposta
   */
  saveProfessionalInfo() {
    let form = this.profForm;
    if (this.profFormUnsaved) {
      let currentProf: Professional = new Professional();
      currentProf.name = form.value.name;
      currentProf.description = form.value.description;

      this.profService.update(currentProf).subscribe(response => {
      });

      this.profFormUnsaved = false;

    }
    // this.project.partnersIds;
  }

  private createClientForm() {
    let clientId: string = this.project.client.id !== undefined && this.project.client.id !== null ? this.project.client.id : '0';

    this.clientForm = this.fb.group({
      briefing: [this.project.briefing],
      clientId: [clientId, Validators.required],
      email: [''],
      cpfCnpj: [''],
      name: ['']
    });
  }

  private createProfessionalForm(professional: Professional): FormGroup {
    return this.fb.group({
      name: [professional.name, Validators.required],
      partnersIds: [this.project.partnersIds],
      description: [professional.description],
    });
  }

  private subscribeToClientChanges() {
    const clientFormChanges$ = this.clientForm.valueChanges;

    clientFormChanges$
      .subscribe(data => {
        this.clientFormUnsaved = true;
      })
  }

  private subscribeToProfessionalChanges() {
    const profFormChanges$ = this.profForm.valueChanges;

    profFormChanges$
      .subscribe(data => {
        this.profFormUnsaved = true;
      })
  }
}
