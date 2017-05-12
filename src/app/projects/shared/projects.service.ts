import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";

import { AuthService } from '../../core/auth.service';
import { Ambience } from './ambience';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Professional } from '../../core/professional';
import { Project } from './project';
import { ProjectStatus } from './project-status.enum';
import { Proposal } from './proposal';
import { ProposalStatus } from './proposal-status.enum';
import { UtilsService } from '../../shared/utils/utils.service';
import { ServicesGroup } from './services-group.enum';

@Injectable()
export class ProjectsService {
  public allProjects: Project[] = [];
  public static readonly proposalStatusIds = {
    Approved: '23D887C3-E7A8-4D15-8724-D86D7D72472D',
    Disabled: '569253EC-BCEA-41EA-9A41-08A9B7D66C9B',
    NotSent: 'DD202B41-E8D6-4670-A097-D5581FFDBBFD',
    Waiting: '9E762380-E8E3-4EB4-AF35-4E5F8476EE7C',
    Deprecated: '0554212D-8FA9-49A1-A782-61895AE8D4CE'
  };
  public static readonly servicesGroupIds = {
    Low: "D0F1E14A-F206-49A0-9FB4-6F3203140D60",
    Medium: "948DB5BB-6F98-4399-95D0-51EA1E40024C",
    High: "9B1D97F4-50DF-415D-872A-9448C822DF1D"
  }

  currentProfessional: Professional;

  private readonly baseUrl = 'http://52.67.21.201/muuving/api/projeto';
  // Observable string sources
  private newProjectTitleDefinedSource = new Subject<string>();
  // Observable string streams
  newProjectTitleDefined$ = this.newProjectTitleDefinedSource.asObservable();


  constructor(
    private http: Http,
    private auth: AuthService,
    private clientService: ClientService
  ) {
    ProjectsService.proposalStatusIds[0] = ProjectsService.proposalStatusIds.Approved;
    ProjectsService.proposalStatusIds[1] = ProjectsService.proposalStatusIds.Disabled;
    ProjectsService.proposalStatusIds[2] = ProjectsService.proposalStatusIds.NotSent;
    ProjectsService.proposalStatusIds[3] = ProjectsService.proposalStatusIds.Waiting;
    ProjectsService.proposalStatusIds[4] = ProjectsService.proposalStatusIds.Deprecated;

    ProjectsService.servicesGroupIds[0] = ProjectsService.servicesGroupIds.Low;
    ProjectsService.servicesGroupIds[1] = ProjectsService.servicesGroupIds.Medium;
    ProjectsService.servicesGroupIds[2] = ProjectsService.servicesGroupIds.High;

    this.currentProfessional = this.auth.currentUser;
    this.getAllByProfessional(this.currentProfessional.id).subscribe((projects: Project[]) => {
      this.allProjects = projects.filter(project => { return project.isActive; });
      console.log(this.allProjects);
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
      // console.log(body);

      return body.map((project) => {
        // if (!project.IsActive) return;
        let activeProposal: Proposal,
          p: Project,
          c: Client;
        // TODO: Get last and active proposal
        let ambiences: Ambience[] = project.ProjetoComodo.map(ambience => {
          let amb: Ambience = new Ambience(ambience.ComodoId, ambience.Descricao);

          switch (ambience.GrupoServicoId.toUpperCase()) {
            case ProjectsService.servicesGroupIds.Low.toUpperCase():
              amb.servicesGroup = ServicesGroup.LOW;
              break;
            case ProjectsService.servicesGroupIds.Medium.toUpperCase():
              amb.servicesGroup = ServicesGroup.MEDIUM;
              break;
            case ProjectsService.servicesGroupIds.High.toUpperCase():
              amb.servicesGroup = ServicesGroup.HIGH;
              break;
            default:
              console.error('Grupo de serviços inválido', ambience.GrupoServicoId);
              break;
          }

          amb.comments = ambience.Observacao;
          amb.area = ambience.MetragemArea;
          amb.cost = ambience.Valor;
          amb.isActive = ambience.IsActive;

          return amb;
        });
        let proposals: Proposal[] = project.Proposta.map(proposal => {
          let propStatus: ProposalStatus;
          let prop: Proposal;

          switch (proposal.StatusId.toUpperCase()) {
            case ProjectsService.proposalStatusIds.Approved.toUpperCase():
              propStatus = ProposalStatus.Approved;
              break;
            case ProjectsService.proposalStatusIds.Deprecated.toUpperCase():
              propStatus = ProposalStatus.Deprecated;
              break;
            case ProjectsService.proposalStatusIds.Disabled.toUpperCase():
              propStatus = ProposalStatus.Disabled;
              break;
            case ProjectsService.proposalStatusIds.Waiting.toUpperCase():
              propStatus = ProposalStatus.Waiting;
              break;
            case ProjectsService.proposalStatusIds.NotSent.toUpperCase():
              propStatus = ProposalStatus.NotSent;
              break;
            default:
              console.error('Status de proposta inválido: ', proposal.StatusId);
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

        p.ambiences = ambiences;
        p.proposals = proposals;
        c.id = project.ClienteId;
        p.client = c;
        p.briefing = project.Briefing;

        return p;
      });
    }).catch(this.handleError);
  }

  getOne(id: string): Project {
    return this.allProjects.find((project: Project) => {
      return project.id === id;
    });

    // return Observable.of(this.allProjects.find((project: Project) => {
    //   return project.id === id;
    // }));
  }

  getProjectsByTitle(title: string): Observable<Project> {
    return Observable.from(this.allProjects)
      .filter((project: Project, index: number) => {
        return UtilsService.replaceSpecialChars(project.title)
          .toLowerCase()
          .indexOf(title.toLowerCase()) > -1

      });
  }

  getOneBySlugTitle(slugTitle: string): Project {
    return this.allProjects.find((project: Project) => {
      return UtilsService.slugify(project.title) === slugTitle;
    });
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
          'UF': project.activeProposal.uf,
          'PropostaProfissionaisParticipantes': [],
          // 'ValorCobrado': 14000,
          // 'ValorRecebido': 0,
          // 'NumeroComodos': 2,
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
      ],
      'ProjetoComodo': []
    }

    if (project.ambiences.length) {
      project.ambiences.forEach(ambience => {
        let ambienceData: any = {
          "ProjetoId": project.id,
          "ComodoId": ambience.id,
          "GrupoServicoId": ProjectsService.servicesGroupIds[ambience.servicesGroup],
          "Descricao": ambience.description,
          "MetragemArea": ambience.area,
          // "MemorialDescritivo": "descrição detalhada",
          "Observacao": ambience.comments,
          "Valor": ambience.cost,
          "IsActive": ambience.isActive
        };

        data.ProjetoComodo.push(ambienceData);
      });
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
