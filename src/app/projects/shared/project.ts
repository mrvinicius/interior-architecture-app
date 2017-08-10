import { Ambience } from './ambience';
import { Client } from '../../client/shared/client';
import { Professional } from '../../core/professional';
import { ProjectStatus } from './project-status.enum';
import { Proposal } from './proposal';
import { UF } from '../../shared/uf.enum';
// import { Service } from './service';

export class Project {
    id?: string;
    title: string;
    professional: Professional;
    briefing?: string;
    client?: Client;
    ambiences?: Ambience[];
    proposals?: Proposal[];
    activeProposal: Proposal;
    images64: WindowBase64
    isActive: boolean;
    
    CEP?: string;
    UF?: string;
    addressArea?: string;
    addressNumber?: number;
    neighborhood?: string;
    city?: string;

    atnProject?: boolean;
    
    constructor(activeProposal: Proposal, id?: string, title?: string, professional?: Professional) {
        this.activeProposal = activeProposal;
        this.id = id;
        this.title = title;
        this.professional = professional;

        this.proposals = [];
        this.ambiences = [];
        this.isActive = true;
    }

    // static parse(projectData): Project {
    //     projectData = JSON.parse(projectData)

    //     let project: Project,
    //         client: Client = new Client(),
    //         prof: Professional = new Professional(),
    //         prop: Proposal;
    //     let proposals: Proposal[] = projectData.Proposta.map(proposal => { return Proposal.parse(proposal) });
    //     let ambiences: Ambience[] = projectData.ProjetoComodo.map(ambience => { return Ambience.parse(ambience) })

    //     client.id = projectData.ClienteId;
    //     prof.id = projectData.ProfissionalId;

    //     project = new Project(prop, projectData.Id, projectData.Descricao, this.currentProfessional);
    //     if (proposals.length > 0) {
    //         projectData.activeProposal = proposals[proposals.length - 1]
    //     } else {
    //         projectData.isActive = false;
    //         new Proposal(false, ProposalStatus.NotSent);
    //     }

    //     p.isActive = projectData.IsActive;
    //     p.ambiences = ambiences;
    //     p.proposals = proposals;
    //     // p.uf = UF[UF[ProjectsService.ufsIds[project.UF]]];

    //     if (proposals.length > 0) {
    //         p.activeProposal = proposals[proposals.length - 1]
    //     } else {
    //         p.isActive = false;
    //         new Proposal(false, ProposalStatus.NotSent);
    //     }

    //     c.id = project.ClienteId;
    //     p.client = c;
    //     p.briefing = project.Briefing;

    //     return project;
    // }


}
