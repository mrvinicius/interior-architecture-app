import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MzModalService, MzToastService } from 'ng2-materialize';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';

import { BillingModalComponent } from '../../billing/billing-modal/billing-modal.component';
import { ProposalService } from '../shared/proposal.service';
import { BillingService } from '../../billing/shared/billing.service';
import { ProfessionalService } from '../../core/professional.service';
import { SpinnerService } from '../../core/spinner/spinner.service';
import { ProjectsService } from '../shared/projects.service';
import { LayoutContentService } from '../../layout/shared/layout-content.service';
import { LayoutSidebarService } from '../../layout/shared/layout-sidebar.service';
import { LayoutHeaderService } from '../../layout/shared/layout-header.service';
import { Project } from '../shared/project';
import { Proposal } from '../shared/proposal';

@Component({
  selector: 'abx-project-proposal-preview',
  templateUrl: './project-proposal-preview.component.html',
  styleUrls: ['./project-proposal-preview.component.scss']
})
export class ProjectProposalPreviewComponent implements OnInit, OnDestroy {
  previewUrl;
  project: Project;
  proposalSent: boolean = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(
    private billingService: BillingService,
    private domSanatizer: DomSanitizer,
    private headerService: LayoutHeaderService,
    private layoutContentService: LayoutContentService,
    private modalService: MzModalService,
    private profService: ProfessionalService,
    private projectService: ProjectsService,
    private propService: ProposalService,
    private route: ActivatedRoute,
    private sidebarService: LayoutSidebarService,
    private spinnerService: SpinnerService,
    private toastService: MzToastService
  ) { }

  ngOnInit() {
    this.headerService.hideHeader();
    this.sidebarService.hideSidebar();
    this.layoutContentService.setOverflowY('hidden');

    this.route.data.subscribe((data: { project: Project }) => {
      this.project = data.project;
      console.log(this.project);

      if (!this.project.activeProposal.url) {
        this.projectService.update(this.project, true)
          .subscribe((project: Project) => {
            this.project.activeProposal.url = project.activeProposal.url;
            console.log(this.project.activeProposal.url);

            this.previewUrl = this.domSanatizer
              .bypassSecurityTrustResourceUrl(this.project.activeProposal.url);
          });
      } else {
        this.previewUrl = this.domSanatizer
          .bypassSecurityTrustResourceUrl(this.project.activeProposal.url);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendProposal() {
    this.spinnerService.toggleLoadingIndicator(true);

    this.spinnerService.toggleLoadingIndicator(false);
    let modalRef = this.modalService.open(BillingModalComponent, {});

    // if (!this.profService.professional.paying) {
    //   this.billingService.billingInfoUpdated$
    //     .takeUntil(this.ngUnsubscribe)
    //     .subscribe((success: boolean) => this.sendProposal());

    //   this.spinnerService.toggleLoadingIndicator(false);
    //   let modalRef = this.modalService.open(BillingModalComponent, {});

    // } else {
    //   if (this.project.client && this.project.client.id) {
    //     this.propService.send(this.project)
    //       .takeUntil(this.ngUnsubscribe)
    //       .subscribe((success: boolean) => {
    //         if (success) {
    //           this.spinnerService.toggleLoadingIndicator(false);
    //           this.proposalSent = true;
    //           this.toastService.show('Projeto enviado!', 3000, 'green');
    //         }
    //       })

    //   } else {
    //     this.spinnerService.toggleLoadingIndicator(false);
    //     this.toastService.show('Selecione um cliente', 3000, 'red');
    //   }
    // }
  }
}
