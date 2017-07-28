import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subject } from "rxjs/Subject";

// import { AuthService } from '../../core/auth.service';
import { Ambience } from './ambience';
import { AmbienceDescription } from './ambience-description.enum';
import { AmbienceService } from './ambience.service';
import { AuthService } from '../../core/auth.service';
import { Bank } from '../../billing/shared/bank';
import { BankAccount } from './../../billing/shared/bank-account';
import { Client } from '../../client/shared/client';
import { ClientService } from '../../client/shared/client.service';
import { Delivery } from './delivery';
import { Professional } from '../../core/professional';
import { ProfessionalService } from '../../core/professional.service';
import { Product } from './product';
import { Project } from './project';
import { ProjectStatus } from './project-status.enum';
import { Proposal } from './proposal';
import { ProposalStatus } from './proposal-status.enum';
import { UtilsService } from '../../shared/utils/utils.service';
import { UF } from '../../shared/uf.enum';
import { Service } from './service.enum';
import { ServicesGroup } from './services-group.enum';

@Injectable()
export class ProjectsService implements Resolve<string>{
  public _allProjects: Project[] = [];
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
  };
  public static readonly timeUnityIds = {
    0: 'b7f70a19-6562-4e2a-840b-c84bf2ee9196',
    'b7f70a19-6562-4e2a-840b-c84bf2ee9196': 0,

    1: 'acf7e97f-0993-4ad4-97a4-af1bd7d6dd3c',
    'acf7e97f-0993-4ad4-97a4-af1bd7d6dd3c': 1,

    2: 'dfaa8fdc-b27a-428c-9412-8b4e521d44b8',
    'dfaa8fdc-b27a-428c-9412-8b4e521d44b8': 2,
  };
  public static readonly ambienceDescriptionIds = {
    'Academia': '1ffe2a2d-a0d0-4ab7-9ae1-289225879e21',
    'Adega': '7a228cbe-7f77-4f3c-a77c-39a113a3707b',
    'Banheiro simples': 'c6abd6e8-110e-4740-9fc1-02164af49eae',
    'Bar': '3239a961-14e1-44ba-860c-8a9ef8e1b93e',
    'Biblioteca': '9447521a-b38a-4654-9e30-f21539c87dda',
    'Closet': 'e9303aa1-e618-4e2b-97ad-582661fd1510',
    'Clínica': 'd21d7db2-7a1f-4ca4-b3eb-349278d2a696',
    'Consultório': 'e83d7974-ba78-4031-8a51-8610f5d5c1b6',
    'Copa': '0987b1f7-7ccc-411c-8322-a8d8d5abec12',
    'Corredores': '0ed1a2b0-ed68-48d6-8030-6d263078677c',
    'Cozinha americana': '8e5e2c64-01dd-4732-a45a-b870fb1a11f5',
    'Cozinha compacta': 'e56bf50e-a54c-49ab-97b1-b38505396f82',
    'Cozinha gourmet': '9cf6d1b5-bfa8-4d84-94bd-e64210b05784',
    'Cozinha planejada': 'd66cdbfb-ddea-4543-a10b-fb44347461d5',
    'Diversos': '08ed0583-8fc0-4122-b127-bb83b2fc7e87',
    'Escritório': '00bc857a-7ca0-4a6b-aaf7-82ac3080339c',
    'Fachadas de casas': '5249f639-9ce8-4b33-a6c6-3262cc3d6fac',
    'Fachadas de prédios': 'a631598c-1ee5-41eb-b251-1d91581093e7',
    'Garagem': 'f333121f-bf01-402f-bf8d-914ecdb3a3fd',
    'Hall': '3d56adc5-e680-4f34-84dc-cb1aa0c8bb50',
    'Home Office': '7c4dfcfb-d6ee-43fd-8d51-5db088c098e0',
    'Jardim': 'c7dd4518-8452-4258-8bd7-5238666c1044',
    'Jardim de inverno': 'f953c548-f783-4c0e-8297-1de1dcad05d4',
    'Lavabo': '8039b807-8d3f-40c6-bb41-b69a718cc8b9',
    'Lavanderia': 'e67bc2a3-80f7-44fb-aa87-feda7ff36b4f',
    'Loja': '9b609e6a-b410-4a4b-9b58-b36d177b5da4',
    'Piscina': '77933ac9-1794-4196-aa87-05ce2a3e86c9',
    'Playground': '48e5cdca-9a6b-4079-9250-45ee14122d12',
    'Quarto de bebê': '5bee6bca-b842-43d5-91e2-4f26ba335b5f',
    'Quarto de casal': 'b4bc14ce-22a2-4a63-9bf9-08088e441f21',
    'Quarto de menina': '47fb08a4-b2d7-4f7b-b09e-e09587486bfc',
    'Quarto de menino': '952877ad-c8f5-4423-9782-c8cfb5dca2fa',
    'Quarto de solteiro': '2a2956e6-0ef4-4656-b16a-3f4907a69081',
    'Quintal': 'ca80bb78-c2a5-48e9-8693-acc3ecdec576',
    'Restaurante': '0f31e566-70ba-48d8-91ed-965c275041b9',
    'Sala de Estar': '48885d7a-9c49-4cb1-8877-2834d491a746',
    'Sala de Jantar': '190f4c23-686b-43d9-855c-edc721548e58',
    'Sala de banho': '45e5b204-ac0c-43c9-9386-40e1247018dc',
    'Sala de jogos': '2fbac08c-b6d9-43d1-a209-df7a2e738e21',
    'Salão de beleza': '900455d8-89c4-4668-943d-ba9145681694',
    'Suíte': 'e00d1fb9-e5c9-4551-bd59-99a50c9e8ccc',
    'Terraço': 'a862aef5-e673-46cb-973e-661d68368418',
    'Varanda': '61e95a8d-be44-4b15-8a1b-3eda54c15a5a',
    'Varanda gourmet': 'c1e97955-7557-4722-bb91-5246faee51f5',
    0: '1ffe2a2d-a0d0-4ab7-9ae1-289225879e21',
    '1ffe2a2d-a0d0-4ab7-9ae1-289225879e21': 0,
    1: '7a228cbe-7f77-4f3c-a77c-39a113a3707b',
    '7a228cbe-7f77-4f3c-a77c-39a113a3707b': 1,
    2: 'c6abd6e8-110e-4740-9fc1-02164af49eae',
    'c6abd6e8-110e-4740-9fc1-02164af49eae': 2,
    3: '3239a961-14e1-44ba-860c-8a9ef8e1b93e',
    '3239a961-14e1-44ba-860c-8a9ef8e1b93e': 3,
    4: '9447521a-b38a-4654-9e30-f21539c87dda',
    '9447521a-b38a-4654-9e30-f21539c87dda': 4,
    5: 'e9303aa1-e618-4e2b-97ad-582661fd1510',
    'e9303aa1-e618-4e2b-97ad-582661fd1510': 5,
    6: 'd21d7db2-7a1f-4ca4-b3eb-349278d2a696',
    'd21d7db2-7a1f-4ca4-b3eb-349278d2a696': 6,
    7: 'e83d7974-ba78-4031-8a51-8610f5d5c1b6',
    'e83d7974-ba78-4031-8a51-8610f5d5c1b6': 7,
    8: '0987b1f7-7ccc-411c-8322-a8d8d5abec12',
    '0987b1f7-7ccc-411c-8322-a8d8d5abec12': 8,
    9: '0ed1a2b0-ed68-48d6-8030-6d263078677c',
    '0ed1a2b0-ed68-48d6-8030-6d263078677c': 9,
    10: '8e5e2c64-01dd-4732-a45a-b870fb1a11f5',
    '8e5e2c64-01dd-4732-a45a-b870fb1a11f5': 10,
    11: 'e56bf50e-a54c-49ab-97b1-b38505396f82',
    'e56bf50e-a54c-49ab-97b1-b38505396f82': 11,
    12: '9cf6d1b5-bfa8-4d84-94bd-e64210b05784',
    '9cf6d1b5-bfa8-4d84-94bd-e64210b05784': 12,
    13: 'd66cdbfb-ddea-4543-a10b-fb44347461d5',
    'd66cdbfb-ddea-4543-a10b-fb44347461d5': 13,
    14: '08ed0583-8fc0-4122-b127-bb83b2fc7e87',
    '08ed0583-8fc0-4122-b127-bb83b2fc7e87': 14,
    15: '00bc857a-7ca0-4a6b-aaf7-82ac3080339c',
    '00bc857a-7ca0-4a6b-aaf7-82ac3080339c': 15,
    16: '5249f639-9ce8-4b33-a6c6-3262cc3d6fac',
    '5249f639-9ce8-4b33-a6c6-3262cc3d6fac': 16,
    17: 'a631598c-1ee5-41eb-b251-1d91581093e7',
    'a631598c-1ee5-41eb-b251-1d91581093e7': 17,
    18: 'f333121f-bf01-402f-bf8d-914ecdb3a3fd',
    'f333121f-bf01-402f-bf8d-914ecdb3a3fd': 18,
    19: '3d56adc5-e680-4f34-84dc-cb1aa0c8bb50',
    '3d56adc5-e680-4f34-84dc-cb1aa0c8bb50': 19,
    20: '7c4dfcfb-d6ee-43fd-8d51-5db088c098e0',
    '7c4dfcfb-d6ee-43fd-8d51-5db088c098e0': 20,
    21: 'c7dd4518-8452-4258-8bd7-5238666c1044',
    'c7dd4518-8452-4258-8bd7-5238666c1044': 21,
    22: 'f953c548-f783-4c0e-8297-1de1dcad05d4',
    'f953c548-f783-4c0e-8297-1de1dcad05d4': 22,
    23: '8039b807-8d3f-40c6-bb41-b69a718cc8b9',
    '8039b807-8d3f-40c6-bb41-b69a718cc8b9': 23,
    24: 'e67bc2a3-80f7-44fb-aa87-feda7ff36b4f',
    'e67bc2a3-80f7-44fb-aa87-feda7ff36b4f': 24,
    25: '9b609e6a-b410-4a4b-9b58-b36d177b5da4',
    '9b609e6a-b410-4a4b-9b58-b36d177b5da4': 25,
    26: '77933ac9-1794-4196-aa87-05ce2a3e86c9',
    '77933ac9-1794-4196-aa87-05ce2a3e86c9': 26,
    27: '48e5cdca-9a6b-4079-9250-45ee14122d12',
    '48e5cdca-9a6b-4079-9250-45ee14122d12': 27,
    28: '5bee6bca-b842-43d5-91e2-4f26ba335b5f',
    '5bee6bca-b842-43d5-91e2-4f26ba335b5f': 28,
    29: 'b4bc14ce-22a2-4a63-9bf9-08088e441f21',
    'b4bc14ce-22a2-4a63-9bf9-08088e441f21': 29,
    30: '47fb08a4-b2d7-4f7b-b09e-e09587486bfc',
    '47fb08a4-b2d7-4f7b-b09e-e09587486bfc': 30,
    31: '952877ad-c8f5-4423-9782-c8cfb5dca2fa',
    '952877ad-c8f5-4423-9782-c8cfb5dca2fa': 31,
    32: '2a2956e6-0ef4-4656-b16a-3f4907a69081',
    '2a2956e6-0ef4-4656-b16a-3f4907a69081': 32,
    33: 'ca80bb78-c2a5-48e9-8693-acc3ecdec576',
    'ca80bb78-c2a5-48e9-8693-acc3ecdec576': 33,
    34: '0f31e566-70ba-48d8-91ed-965c275041b9',
    '0f31e566-70ba-48d8-91ed-965c275041b9': 34,
    35: '48885d7a-9c49-4cb1-8877-2834d491a746',
    '48885d7a-9c49-4cb1-8877-2834d491a746': 35,
    36: '190f4c23-686b-43d9-855c-edc721548e58',
    '190f4c23-686b-43d9-855c-edc721548e58': 36,
    37: '45e5b204-ac0c-43c9-9386-40e1247018dc',
    '45e5b204-ac0c-43c9-9386-40e1247018dc': 37,
    38: '2fbac08c-b6d9-43d1-a209-df7a2e738e21',
    '2fbac08c-b6d9-43d1-a209-df7a2e738e21': 38,
    39: '900455d8-89c4-4668-943d-ba9145681694',
    '900455d8-89c4-4668-943d-ba9145681694': 39,
    40: 'e00d1fb9-e5c9-4551-bd59-99a50c9e8ccc',
    'e00d1fb9-e5c9-4551-bd59-99a50c9e8ccc': 40,
    41: 'a862aef5-e673-46cb-973e-661d68368418',
    'a862aef5-e673-46cb-973e-661d68368418': 41,
    42: '61e95a8d-be44-4b15-8a1b-3eda54c15a5a',
    '61e95a8d-be44-4b15-8a1b-3eda54c15a5a': 42,
    43: 'c1e97955-7557-4722-bb91-5246faee51f5',
    'c1e97955-7557-4722-bb91-5246faee51f5': 43,
  };
  public static readonly servicesIds = {
    // 'Layout de distribuição de móveis + Detalhamento de poucos móveis': '',
    // 'Escolha de tecidos, móveis, revestimentos e luminárias': '',
    // 'Projeto de Arquitetura de Interiores + Detalhamento de mobiliário': '',
    // 'Escolha de acabamentos': '',
    // 'Distribuição e localização de pontos elétricos e hidráulicos': '',
    // 'Detalhamento de banheiros e cozinhas': '',
    // 'Detalhamento de forro': '',

    '4b4b67ec-c5b8-4ecf-8072-05b60fe1eb1f': 0,
    'bf6d5c12-fa55-4fa6-8207-84b6cc7246b0': 1,
    '6134c278-45be-4db3-a1b2-061f21077a2b': 2,
    'd55a5ae8-441c-446b-88f8-f60be01558f6': 3,
    '044f2b80-cdf2-44c1-979e-91726b571eca': 4,
    '997cc89b-d375-4455-8d0a-86abe19e3076': 5,
    '612cdb70-0bb6-4ada-a9b5-13bf6ab0da27': 6,

    0: '4b4b67ec-c5b8-4ecf-8072-05b60fe1eb1f',
    1: 'bf6d5c12-fa55-4fa6-8207-84b6cc7246b0',
    2: '6134c278-45be-4db3-a1b2-061f21077a2b',
    3: 'd55a5ae8-441c-446b-88f8-f60be01558f6',
    4: '044f2b80-cdf2-44c1-979e-91726b571eca',
    5: '997cc89b-d375-4455-8d0a-86abe19e3076',
    6: '612cdb70-0bb6-4ada-a9b5-13bf6ab0da27',
  };
  public static readonly ufsIds = {
    'AC': 0,
    0: 'AC',
    'AL': 1,
    1: 'AL',
    'AP': 2,
    2: 'AP',
    'AM': 3,
    3: 'AM',
    'BA': 4,
    4: 'BA',
    'CE': 5,
    5: 'CE',
    'DF': 6,
    6: 'DF',
    'ES': 7,
    7: 'ES',
    'GO': 8,
    8: 'GO',
    'MA': 9,
    9: 'MA',
    'MT': 10,
    10: 'MT',
    'MS': 11,
    11: 'MS',
    'MG': 12,
    12: 'MG',
    'PA': 13,
    13: 'PA',
    'PB': 14,
    14: 'PB',
    'PR': 15,
    15: 'PR',
    'PE': 16,
    16: 'PE',
    'PI': 17,
    17: 'PI',
    'RJ': 18,
    18: 'RJ',
    'RN': 19,
    19: 'RN',
    'RS': 20,
    20: 'RS',
    'RO': 21,
    21: 'RO',
    'RR': 22,
    22: 'RR',
    'SC': 23,
    23: 'SC',
    'SP': 24,
    24: 'SP',
    'SE': 25,
    25: 'SE',
    'TO': 26,
    26: 'TO'
  };
  public static readonly professionIds = {
    'ARQ': 0,
    'DES': 1,
    'EST': 2,
    0: 'ARQ',
    1: 'DES',
    2: 'EST'
  }
  public static readonly deliveryIds = {
    0: 'b770caeb-083e-468c-a0b7-b985571edfda',
    'b770caeb-083e-468c-a0b7-b985571edfda': 0,
    1: '2cc405b4-de59-4972-b30d-255da748fc99',
    '2cc405b4-de59-4972-b30d-255da748fc99': 1,
    2: '97c60797-8f9e-4a1b-a16b-b5b187bee6df',
    '97c60797-8f9e-4a1b-a16b-b5b187bee6df': 2,
    3: '36170cee-d1a7-423e-b4e1-1debfbea9559',
    '36170cee-d1a7-423e-b4e1-1debfbea9559': 3,
    4: '0037a6e3-bd04-459a-adc7-b94c4a3678a8',
    '0037a6e3-bd04-459a-adc7-b94c4a3678a8': 4,
    5: '81813a30-44cd-450a-b3ec-884672fe6c20',
    '81813a30-44cd-450a-b3ec-884672fe6c20': 5,
    6: '768fa66b-4114-4bbd-bee8-a1ed70487fce',
    '768fa66b-4114-4bbd-bee8-a1ed70487fce': 6,
    7: 'bef5ccce-a497-4e30-a462-368a128d8250',
    'bef5ccce-a497-4e30-a462-368a128d8250': 7,
    8: '5cd9ea71-dce8-4423-93e8-631ec86b6d33',
    '5cd9ea71-dce8-4423-93e8-631ec86b6d33': 8,
    9: 'e31476cf-bc97-4ec8-9289-df8fa44d5f63',
    'e31476cf-bc97-4ec8-9289-df8fa44d5f63': 9,
    10: 'c45080ad-be47-4ba0-bc10-a5ddb60df447',
    'c45080ad-be47-4ba0-bc10-a5ddb60df447': 10,
    11: 'bbc9181c-543a-4682-94b2-47e74ea6c78c',
    'bbc9181c-543a-4682-94b2-47e74ea6c78c': 11,
    12: '6e94ce04-d8f0-4f57-aad5-43889f6c239e',
    '6e94ce04-d8f0-4f57-aad5-43889f6c239e': 12,
    13: 'a46058ac-d651-4266-83bf-41b747364c6e',
    'a46058ac-d651-4266-83bf-41b747364c6e': 13
  };

  private readonly baseUrl = 'http://52.67.21.201/muuving/api/projeto';
  // Observable string sources
  private newProjectTitleDefinedSource = new Subject<string>();
  // Observable string streams
  newProjectTitleDefined$ = this.newProjectTitleDefinedSource.asObservable();


  constructor(
    private auth: AuthService,
    private http: Http,
    private profService: ProfessionalService,
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
  }

  set allProjects(projects: Project[]) {
    this._allProjects = projects;
  }

  get allProjects(): Project[] {
    return this._allProjects;
  }

  add(title: string): Observable<Project> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.put(this.baseUrl + '/add', {
      "ProfissionalId": this.auth.getCurrentUser().id,
      "Descricao": title,
      "IsActive": true,
      "Proposta": [
        {
          "Descricao": "",
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
      let currentProf =
        new Professional(this.auth.getCurrentUser().name, this.auth.getCurrentUser().email, this.auth.getCurrentUser().id);
      let newProject =
        new Project(projectProposal, body.Id, body.Descricao, currentProf);
      newProject.client = new Client();
      newProject.activeProposal = new Proposal(false, ProposalStatus.NotSent, body.Proposta[0].Id);
      if (!this.allProjects) this.allProjects = [];

      this.allProjects.push(newProject);
      return newProject;
    }).catch(this.handleError);
  }

  defineNewProjectTitleName(name: string) {
    this.newProjectTitleDefinedSource.next(name);
  }

  disableProject(id: string): Observable<Project> {
    let p = this.allProjects.find(project => {
      return project.id === id;
    });

    p.isActive = false;
    return this.update(p);
  }

  getAllByProfessional(professionalId: string, take: number, skip?: number): Observable<Project[]> {

    let options = new RequestOptions({ headers: this.getHeaders() });
    let data = {
      Skip: skip,
      Take: take,
      ProfissionalId: professionalId
    };

    if (this.allProjects === undefined || this.allProjects.length < 1) {
      return this.http.post(this.baseUrl + '/getAll', data, options).map((response: Response) => {
        let body = JSON.parse(response.text());
        let projects: Project[] = [];

        if (body.length) {
          projects = body.map((project) => {
            if (!project.IsActive) {
              let p = new Project(new Proposal(false, ProposalStatus.NotSent));
              p.isActive = false
              return p
            } else {
              let activeProposal: Proposal,
                p: Project,
                c: Client;

              // TODO: Get last and active proposal
              let ambiences: Ambience[] = project.ProjetoComodo.map(ambience => {
                let amb: Ambience = new Ambience(ambience.ComodoId);

                if (ambience.Descricao in AmbienceDescription) {
                  amb.ambienceDescription = AmbienceDescription[AmbienceDescription[ProjectsService.ambienceDescriptionIds[ambience.ComodoId]]]
                }

                let services: Service[] = ambience.ProjetoComodoServicos.map(service => {
                  return Service[Service[ProjectsService.servicesIds[service.TipoServicoId]]]
                });

                amb.services = services;

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

                if (proposal.ContaBancariaId) {
                  prop.bankAccount = new BankAccount();
                  prop.bankAccount.id = proposal.ContaBancariaId;

                  if (proposal.BancoId) {
                    prop.bankAccount.bank = new Bank(
                      proposal.BancoId
                    );
                  }
                }

                prop.deadlineCount = proposal.Prazo;
                prop.deadlineTimeUnity = ProjectsService.timeUnityIds[proposal.TempoId];
                prop.url = proposal.UrlPreview;
                prop.intro = proposal.Descricao;
                prop.cost = proposal.CustoTotal;
                prop.costToClient = proposal.ValorCobrado;
                prop.costToReceive = proposal.ValorRecebido;
                prop.costFinal = proposal.ValorFatura;
                prop.followUp = proposal.AcompanhamentoObra;

                if (proposal.PropostaEntrega.length) {
                  prop.deliveries = proposal.PropostaEntrega.map(delivery => {

                    let d: Delivery = new Delivery();
                    d.deliveryDescription = ProjectsService.deliveryIds[delivery.TipoEntregaId];
                    d.duration = delivery.Prazo;
                    d.durationTimeUnity = ProjectsService.timeUnityIds[delivery.TempoId];


                    return d;
                  });
                }

                prop.professionalsIds =
                  proposal.PropostaProfissionaisParticipantes.map(professional => {
                    return professional.ProfissionalId;
                  });

                return prop;
              });

              let currentProf =
                new Professional(this.auth.getCurrentUser().name, this.auth.getCurrentUser().email, this.auth.getCurrentUser().id);

              c = new Client();
              p = new Project(activeProposal, project.Id, project.Descricao, currentProf);
              p.isActive = project.IsActive;
              p.ambiences = ambiences;
              p.proposals = proposals;
              p.UF = project.UF;
              p.CEP = project.CEP;
              p.addressArea = project.Logradouro;
              p.addressNumber = project.NumeroLogradouro;
              p.neighborhood = project.Bairro;
              p.city = project.Cidade;

              if (proposals.length > 0) {
                p.activeProposal = proposals[proposals.length - 1]
              } else {
                p.isActive = false;
                new Proposal(false, ProposalStatus.NotSent);
              }

              c.id = project.ClienteId;
              p.client = c;
              p.briefing = project.Briefing;

              return p;
            }

          });
        }

        this.allProjects = projects.filter(project => project.isActive);

        return projects;
      }).catch(this.handleError);
    } else {
      return Observable.of(this.allProjects);
    }


  }

  private getFromBackEnd(id: string): Observable<Project> {
    let options = new RequestOptions({ headers: this.getHeaders() });

    return this.http.get(this.baseUrl + '/getone?id=' + id, options)
      .map((response: Response) => {
        let project = JSON.parse(response.text());
        // let client = new Client(body.Nome, body.Email, body.ID);
        // client.cpfCnpj = body.CpfCnpj;
        let activeProposal: Proposal,
          p: Project,
          c: Client;

        // TODO: Get last and active proposal
        let ambiences: Ambience[] = project.ProjetoComodo.map(ambience => {
          let amb: Ambience = new Ambience(ambience.ComodoId);

          if (ambience.Descricao in AmbienceDescription) {
            amb.ambienceDescription = AmbienceDescription[AmbienceDescription[ProjectsService.ambienceDescriptionIds[ambience.ComodoId]]]
          }

          let products: Product[] = ambience.ProjetoComodoProduto.map(product => {
            let p: Product = new Product();

            return p;
          });

          let services: Service[] = ambience.ProjetoComodoServicos.map(service => {
            return Service[Service[ProjectsService.servicesIds[service.TipoServicoId]]]
          });

          amb.services = services;

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

          if (proposal.ContaBancariaId) {
            prop.bankAccount = new BankAccount(
              // proposal.ContaBancaria.Agencia,
              // proposal.ContaBancaria.Conta,
              // proposal.ContaBancaria.DigitoConta,
              // proposal.ContaBancaria.Id,
            );
            prop.bankAccount.id = proposal.ContaBancariaId;

            if (proposal.BancoId) {
              prop.bankAccount.bank = new Bank(
                proposal.BancoId
                // proposal.ContaBancaria.Banco.Id,
                // proposal.ContaBancaria.Banco.Nome,
                // proposal.ContaBancaria.Banco.NomeCompleto,
              );
            }
          }

          prop.deadlineCount = proposal.Prazo;
          prop.deadlineTimeUnity = ProjectsService.timeUnityIds[proposal.TempoId];
          prop.url = proposal.UrlPreview;
          prop.intro = proposal.Descricao;
          prop.cost = proposal.CustoTotal;
          prop.costToClient = proposal.ValorCobrado;
          prop.costToReceive = proposal.ValorRecebido;
          prop.costFinal = proposal.ValorFatura;
          prop.followUp = proposal.AcompanhamentoObra;

          if (proposal.PropostaEntrega.length) {
            prop.deliveries = proposal.PropostaEntrega.map(delivery => {

              let d: Delivery = new Delivery();
              d.deliveryDescription = ProjectsService.deliveryIds[delivery.TipoEntregaId];
              d.duration = delivery.Prazo;
              d.durationTimeUnity = ProjectsService.timeUnityIds[delivery.TempoId];


              return d;
            });
          }

          prop.professionalsIds =
            proposal.PropostaProfissionaisParticipantes.map(professional => {
              return professional.ProfissionalId;
            });

          return prop;
        });

        let currentProf =
          new Professional(this.auth.getCurrentUser().name, this.auth.getCurrentUser().email, this.auth.getCurrentUser().id);

        c = new Client();
        p = new Project(activeProposal, project.Id, project.Descricao, currentProf);
        p.isActive = project.IsActive;
        p.ambiences = ambiences;
        p.proposals = proposals;
        p.UF = project.UF;
        p.CEP = project.CEP;
        p.addressArea = project.Logradouro;
        p.addressNumber = project.NumeroLogradouro;
        p.neighborhood = project.Bairro;
        p.city = project.Cidade;

        if (proposals.length > 0) {
          p.activeProposal = proposals[proposals.length - 1]
        } else {
          p.isActive = false;
          new Proposal(false, ProposalStatus.NotSent);
        }

        c.id = project.ClienteId;
        p.client = c;
        p.briefing = project.Briefing;

        return p;
        // return client;
      })
      .catch(this.handleError);
  }

  getOneById(id: string, fromBackEnd?: boolean): Observable<Project> {
    if (fromBackEnd) {
      return this.getFromBackEnd(id);
    } else {
      if (this.allProjects !== undefined && this.allProjects.length) {
        let project = this.allProjects.find((project: Project) => {
          return project.id === id;
        });

        return Observable.of(project);
      } else {
        return this.getFromBackEnd(id);
      }
    }
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

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<string> {
    const pathParam: string = 'title';

    let project = this.getOneBySlugTitle(route.params[pathParam]);
    
    if (project && project.title)
      return Observable.of(project.title);

    return undefined;
  }

  // TODO: Implement Search with layout search input
  search(title: string): Promise<Project[]> {
    title = UtilsService.replaceSpecialChars(title);

    let projectList = this.allProjects.filter(
      project => UtilsService.replaceSpecialChars(project.title).toLowerCase().indexOf(title.toLowerCase()) > -1
    );

    return Promise.resolve(this.allProjects);
  }

  update(project: Project, generateProposal?: boolean): Observable<Project> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    let projectData = {
      'Id': project.id,
      'ProfissionalId': this.auth.getCurrentUser().id,
      'ClienteId': project.client.id,
      'Descricao': project.title,
      'Briefing': project.briefing,
      'IsActive': project.isActive,
      'UF': project.UF,
      'CEP': project.CEP,
      'Logradouro': project.addressArea,
      'NumeroLogradouro': project.addressNumber,
      'Bairro': project.neighborhood,
      "Cidade": project.city,
      'Proposta': [
        {
          'Id': project.activeProposal.id,
          'Descricao': project.activeProposal.intro,
          'StatusId': ProjectsService.proposalStatusIds[project.activeProposal.status],
          "Prazo": project.activeProposal.deadlineCount,
          "TempoId": ProjectsService.timeUnityIds[project.activeProposal.deadlineTimeUnity],
          'Observação': project.activeProposal.comments,
          'NumeroComodos': 0,
          'ValorFatura': project.activeProposal.costFinal,
          'BancoId': undefined,
          'ContaBancariaId': undefined,
          'GeraPropostaQwilr': generateProposal,
          'AcompanhamentoObra': project.activeProposal.followUp,
          // "Banco": null,
          // "ContaBancaria": null,
          'PropostaEntrega': [],
          'PropostaProfissionaisParticipantes': []
        }
      ],
      'ProjetoComodo': []
    }

    if (project.activeProposal.bankAccount && project.activeProposal.bankAccount.bank) {
      projectData.Proposta[0].BancoId = project.activeProposal.bankAccount.bank.id;
    }

    if (project.activeProposal.bankAccount) {
      projectData.Proposta[0].ContaBancariaId = project.activeProposal.bankAccount.id;
    }

    if (project.ambiences.length) {
      projectData.Proposta[0].NumeroComodos = project.ambiences.length;
      project.ambiences.forEach(ambience => {
        if (ambience.area && ambience.services && ambience.services.length) {
          let ambienceData: any = {
            "ProjetoId": project.id,
            "ComodoId": ambience.id,
            "GrupoServicoId": ProjectsService.servicesGroupIds[ambience.servicesGroup],
            "Descricao": AmbienceDescription[ambience.ambienceDescription],
            "MetragemArea": ambience.area,
            "IsActive": ambience.isActive,
            "Observacao": ambience.comments,
            "ProjetoComodoServicos": []
            // "MemorialDescritivo": "descrição detalhada",
            // "Valor": ambience.cost,
          };

          ambience.services.forEach(service => {
            ambienceData.ProjetoComodoServicos.push({
              'TipoServicoId': ProjectsService.servicesIds[service]
            });
          })

          projectData.ProjetoComodo.push(ambienceData);
        } else {
          return;
        }
      });
    }

    if (project.activeProposal.professionalsIds !== undefined) {
      project.activeProposal.professionalsIds.forEach(id => {
        projectData.Proposta[0].PropostaProfissionaisParticipantes.push({
          'PropostaId': project.activeProposal.id,
          'ProfissionalId': id
        });
      });
    }

    let currentProfInPartners = projectData.Proposta[0].PropostaProfissionaisParticipantes
      .find(part => part.ProfissionalId === this.auth.getCurrentUser().id)

    if (currentProfInPartners === undefined) {
      projectData.Proposta[0].PropostaProfissionaisParticipantes.push({
        'PropostaId': project.activeProposal.id,
        'ProfissionalId': this.auth.getCurrentUser().id
      })
    }

    if (project.activeProposal.deliveries !== undefined) {
      project.activeProposal.deliveries.forEach(delivery => {
        if (delivery) {
          let deliveryData: any = {
            'TipoEntregaId': ProjectsService.deliveryIds[delivery.deliveryDescription],
            'TempoId': ProjectsService.timeUnityIds[delivery.durationTimeUnity],
            'Prazo': delivery.duration
          };

          projectData.Proposta[0]['PropostaEntrega'].push(deliveryData);
        }
      });
    }

    // console.log(projectData);

    return this.http.post(this.baseUrl + '/update', projectData, options)
      .map((response: Response) => {
        let project = JSON.parse(response.text());

        let activeProposal: Proposal,
          p: Project,
          c: Client,
          proposals: Proposal[];

        if (project.Proposta && project.Proposta.length) {
          proposals = project.Proposta.map(proposal => {
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

            prop.url = proposal.UrlPreview;
            prop.intro = proposal.Descricao;
            prop.cost = proposal.CustoTotal;
            prop.costToClient = proposal.ValorCobrado;
            prop.costToReceive = proposal.ValorRecebido;
            prop.professionalsIds =
              proposal.PropostaProfissionaisParticipantes.map(professional => {
                return professional.ProfissionalId;
              });

            return prop;
          });
        }

        let currentProf =
          new Professional(this.auth.getCurrentUser().name, this.auth.getCurrentUser().email, this.auth.getCurrentUser().id);
        c = new Client();
        p = new Project(activeProposal, project.Id, project.Descricao, currentProf);
        p.isActive = project.IsActive;
        p.proposals = proposals;
        // p.UF = UF[UF[ProjectsService.ufsIds[project.UF]]];
        p.UF = project.UF;


        if (proposals.length > 0) {
          p.activeProposal = proposals[proposals.length - 1]
        } else {
          p.isActive = false;
          new Proposal(false, ProposalStatus.NotSent);
        }

        c.id = project.ClienteId;
        p.client = c;
        p.briefing = project.Briefing;

        return p;

      });
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
