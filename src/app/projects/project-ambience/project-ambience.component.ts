import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MdlExpansionPanelComponent } from '@angular-mdl/expansion-panel';

import { Ambience } from '../shared/ambience';
import { AmbienceService } from '../shared/ambience.service';
import { ProjectServicesService } from '../shared/project-services.service';
import { Service } from '../shared/service';
import { ServiceType } from '../shared/service-type';

@Component({
  selector: 'app-project-ambience',
  templateUrl: './project-ambience.component.html',
  styleUrls: ['./project-ambience.component.css']
})
export class ProjectAmbienceComponent implements OnInit {
  currentAmbience: Ambience;

  @ViewChild('newServicePanel') newServicePanel: MdlExpansionPanelComponent;
  newService: Service;
  newServiceForm: FormGroup = undefined;
  servicesForms: FormGroup[];
  hasNewSubService: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ambienceService: AmbienceService,
    private projectServService: ProjectServicesService
  ) {
    this.activateRoute.params
      .switchMap((params: Params) => this.ambienceService.getOne(params['id']))
      .subscribe(ambience => {
        this.currentAmbience = ambience;

        if (ambience.services && ambience.services.length > 0)
          ambience.services.forEach((service) => {
            let formGroup = this.createServiceForm(service);
            this.servicesForms.push(formGroup);
          });
        // this.servicesForms = this.createServicesForms(ambience.services);
        // console.log(this.servicesForms[0]);

      });
  }

  getServiceTypeDescription(id: string): string {
    let sType = this.serviceTypes().find((sType: ServiceType) => {
      return sType.id === id;
    });

    return sType.typeDescription;
  }

  ngOnInit() {
    let urlPath = this.activateRoute.snapshot.url.find((urlSegment: UrlSegment) => {
      return urlSegment.path === 'novo';
    });

    if (urlPath === undefined) {
      this.activateRoute.params
        .switchMap((params: Params) => this.ambienceService.getOne(params['id']))
        .subscribe(ambience => {
          this.currentAmbience = ambience;

          if (ambience.services && ambience.services.length > 0)
            ambience.services.forEach((service: Service) => { this.createServiceForm(service); });
          // this.servicesForms = this.createServicesForms(ambience.services);
          // console.log(this.servicesForms[0]);

        });

    }

    let s = new Service();
    s.serviceType = new ServiceType();
    this.newServiceForm = this.createServiceForm(s);

    // this.createClientForm();
    // this.subscribeToClientChanges();

    // this.profForm = this.createProfessionalForm(this.professional);
    // this.subscribeToProfessionalChanges();

    // this.proposalForm = this.createProposalForm(this.project);
    // this.subscribeToProposalChanges();
    // // this.servicesForms = this.createServicesForms(this.project.services);

    // this.profService.professionalAdded$.subscribe((newProfessional: Professional) => {
    //   // if  !this.project.partnersIds.length) this.project.partnersIds = []

    //   // this.project.partnersIds.push(newProfessional.id);
    //   this.profForm.value.partnersIds.push(newProfessional.id);
    // });

  }

  serviceTypes(): ServiceType[] {
    return this.projectServService.serviceTypes;
  }

  showNewServicePanel() {
    this.newServicePanel.expand();

    if (this.newServiceForm !== undefined) {
      // Já existe um novo ambiente não salvo ainda
      return;
    } else {
      this.newService = new Service();
      this.newService.serviceType = new ServiceType();
      // this.newService.subServices = [];
      this.newServiceForm = this.createServiceForm(this.newService);
      // check another new service
      // push projeto
      // build form
      // add DOM

    }
  }

  private createServiceForm(service: Service): FormGroup {
    let serviceType: ServiceType =
      service.serviceType !== undefined ? service.serviceType : new ServiceType();
    let typeDescription: string =
      service.serviceType.typeDescription !== undefined ? service.serviceType.typeDescription : '';

    return this.fb.group({
      serviceTypeId: [serviceType.id],
      serviceDesc: [typeDescription]
    });
  }
}
