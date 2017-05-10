import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";

import { AuthService } from '../../core/auth.service';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Professional } from '../../core/professional';
import { Project } from './project';
import { ProjectStatus } from './project-status.enum';
import { Proposal } from './proposal';
import { ProposalStatus } from './proposal-status.enum';
import { UtilsService } from '../../shared/utils/utils.service';

@Injectable()
export class ProjectsService {
  public allProjects: Project[] = [];
  currentProfessional: Professional;
  private readonly baseUrl = 'http://52.67.21.201/muuving/api/projeto';
  static readonly proposalStatusIds = {
    Approved: '23D887C3-E7A8-4D15-8724-D86D7D72472D',
    Disabled: '569253EC-BCEA-41EA-9A41-08A9B7D66C9B',
    NotSent: 'DD202B41-E8D6-4670-A097-D5581FFDBBFD',
    Waiting: '9E762380-E8E3-4EB4-AF35-4E5F8476EE7C',
    Deprecated: '0554212D-8FA9-49A1-A782-61895AE8D4CE',
    0: '23D887C3-E7A8-4D15-8724-D86D7D72472D',
    1: '569253EC-BCEA-41EA-9A41-08A9B7D66C9B',
    2: 'DD202B41-E8D6-4670-A097-D5581FFDBBFD',
    3: '9E762380-E8E3-4EB4-AF35-4E5F8476EE7C',
    4: '0554212D-8FA9-49A1-A782-61895AE8D4CE'
  };
  // Observable string sources
  private newProjectTitleDefinedSource = new Subject<string>();
  // Observable string streams
  newProjectTitleDefined$ = this.newProjectTitleDefinedSource.asObservable();


  constructor(
    private http: Http,
    private auth: AuthService,
    private clientService: ClientService
  ) {
    this.currentProfessional = this.auth.currentUser;

    this.getAllByProfessional(this.currentProfessional.id).subscribe((projects: Project[]) => {
      this.allProjects = projects;
      console.log(projects);

    });
  }

  add(title: string): Observable<Project> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.put(this.baseUrl + '/add', {
      "ProfissionalId": this.auth.currentUser.id,
      "Descricao": title,
      "IsActive": true,
      "Proposta": [
        {
          "Descricao": " ",
          "ValorCobrado": 0,
          "ValorRecebido": 0,
          "NumeroComodos": 0,
          "MetragemArea": 0,
          "BancoId": null,
          "ContaBancariaId": null,
          "StatusId": ProjectsService.proposalStatusIds.NotSent,
        }
      ]
    }, options).map((response: Response) => {
      let body = JSON.parse(response.text());
      let projectProposal = new Proposal(false, ProposalStatus.NotSent);

      let newProject = new Project(projectProposal, body.Id, body.Descricao, this.currentProfessional);
      newProject.client = new Client();
      newProject.activeProposal = new Proposal(false, ProposalStatus.NotSent, body.Proposta[0].Id);

      this.allProjects.push(newProject);
      return newProject;
    }).catch(this.handleError);
  }

  defineNewProjectTitleName(name: string) {
    this.newProjectTitleDefinedSource.next(name);
  }

  disableProject(id: string): Observable<Response> {
    let p = this.allProjects.find(project => {
      return project.id === id;
    });

    p.isActive = false;
    return this.update(p);
  }

  getAllByProfessional(professionalId: string, take: number = 999, skip?: number): Observable<Project[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.post(this.baseUrl + '/getAll', {
      Skip: skip,
      Take: take,
      ProfissionalId: professionalId
    }, options).map((response: Response) => {
      let body = JSON.parse(response.text());
      console.log(body);


      return body.map((project) => {
        // if (!project.IsActive) return;
        let activeProposal: Proposal,
          p: Project,
          c: Client;
        // TODO: Get last and active proposal

        let proposals: Proposal[] = project.Proposta.map(proposal => {
          let propStatus: ProposalStatus;
          let prop: Proposal;

          switch (proposal.StatusId) {
            case ProjectsService.proposalStatusIds.Approved:
              propStatus = ProposalStatus.Approved;
              break;
            case ProjectsService.proposalStatusIds.Deprecated:
              propStatus = ProposalStatus.Deprecated;
              break;
            case ProjectsService.proposalStatusIds.Disabled:
              propStatus = ProposalStatus.Disabled;
              break;
            case ProjectsService.proposalStatusIds.Waiting:
              propStatus = ProposalStatus.Waiting;
              break;
            case ProjectsService.proposalStatusIds.NotSent:
              propStatus = ProposalStatus.NotSent;
              break;
            default:
              propStatus = ProposalStatus.NotSent;
              break;
          }

          prop = new Proposal(
            proposal.ValorRecebido === 0 ? false : true,
            propStatus,
            proposal.Id
          );

          prop.intro = proposal.Descricao;
          prop.cost = proposal.CustoTotal;
          prop.uf = proposal.UF;
          prop.professionalsIds =
            proposal.PropostaProfissionaisParticipantes.map(professional => {
              return professional.ProfissionalId;
            });

          return prop;
        });


        c = new Client();
        p = new Project(activeProposal, project.Id, project.Descricao, this.currentProfessional);
        p.isActive = project.IsActive;

        if (proposals.length > 0) {
          p.activeProposal = proposals[proposals.length - 1]
        } else {
          p.isActive = false;
          new Proposal(false, ProposalStatus.NotSent);
        }

        p.proposals = proposals;
        c.id = project.ClienteId;
        p.client = c;
        p.briefing = project.Briefing;

        return p;
      });
    }).catch(this.handleError);

  }

  getProjectsByTitle(title: string): Observable<Project> {
    return Observable.from(this.allProjects)
      .filter((project: Project, index: number) => {
        return UtilsService.replaceSpecialChars(project.title)
          .toLowerCase()
          .indexOf(title.toLowerCase()) > -1

      });
  }

  getProjectBySlugTitle(slugTitle: string): Observable<Project> {
    let p = this.allProjects.find((project: Project) => {
      return UtilsService.slugify(project.title) === slugTitle;
    });

    return Observable.of(p);
  }

  // TODO: Implement Search with layout search input
  search(title: string): Promise<Project[]> {
    title = UtilsService.replaceSpecialChars(title);

    let projectList = this.allProjects.filter(
      project => UtilsService.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
    );

    return Promise.resolve(this.allProjects);
  }

  // TODO: Update Feature
  update(project: Project): Observable<Response> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      'Id': project.id,
      'ProfissionalId': this.currentProfessional.id,
      'ClienteId': project.client.id,
      'Descricao': project.title,
      'Briefing': project.briefing,
      'IsActive': project.isActive,
      'Proposta': [
        {
          'Id': project.activeProposal.id,
          'Descricao': project.activeProposal.intro,
          'CustoTotal': project.activeProposal.cost,
          'StatusId': ProjectsService.proposalStatusIds[2],
          // 'ValorCobrado': 14000,
          // 'ValorRecebido': 0,
          // 'NumeroComodos': 2,
          'UF': project.activeProposal.uf,
          'PropostaProfissionaisParticipantes': [],
          // 'CEP': '04052652',
          // 'MetragemArea': 12,
          // 'BancoId': null,
          // 'ContaBancariaId': null,
          // 'PropostaServicos': [
          //   {
          //     'TipoServicoId': 'BA469642-6D55-44A2-8BF9-11207435DA17',
          //     'Prazo': 2,
          //     'TempoId': 'B7F70A19-6562-4E2A-840B-C84BF2EE9196',
          //     'Descricao': 'Serviços executados na reforma',
          //     'Valor': 550,
          //     'DataEntrega': '2017-05-15T00:00:00.0000000-00:00',
          //     'DescricaoPadrao': false
          //   }
          // ]
        }
      ]
    }

    if (project.activeProposal.professionalsIds !== undefined) {
      project.activeProposal.professionalsIds.forEach(id => {
        data.Proposta[0].PropostaProfissionaisParticipantes.push({
          'ProfissionalId': id
        });
      });
    }

    console.log(data);

    return this.http.post(this.baseUrl + '/update', data, options);
  }

  private getHeaders() {
    let headers = new Headers();

    headers.append('Authorization', 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    return headers;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
