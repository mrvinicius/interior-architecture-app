import { Ambience } from './ambience';
import { Client } from '../../client/shared/client';
import { Professional } from '../../core/professional';
import { ProjectStatus } from './project-status.enum';
import { Proposal } from './proposal';
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
    isActive: boolean;

    constructor(activeProposal: Proposal, id?: string, title?: string, professional?: Professional) {
        this.activeProposal = activeProposal;
        this.id = id;
        this.title = title;
        this.professional = professional;

        this.proposals = [];
        this.ambiences = [];
        this.isActive = true;
    }
}


/**
 
 Titulo
 Briefing = Descricao?
 Introdução da proposta
 Profissionais envolvidos (exceto o atual)

 Foi pago? (boolean)
 Status (Não enviado, Aguardando aprovação, Aprovado, Desativado)
 Custo total

 */