import { Project } from './project';
import { ProjectStatus } from './project-status.enum';
import { CLIENTS } from '../../client/shared/mock-client';

let p1 = new Project(),
    p2 = new Project(),
    p3 = new Project(),
    p4 = new Project();

p1.id = 1;
p1.title = 'Pálacio de Marajá';
p1.client = CLIENTS[0];
p1.wasPaid = false;
p1.status = ProjectStatus.Waiting;

p2.id = 2;
p2.title = 'Casa na Árvore';
p2.client = CLIENTS[1];
p2.wasPaid = true;
p2.status = ProjectStatus.Waiting;

p3.id = 3;
p3.title = 'Casa Roberta';
p3.client = CLIENTS[2];
p3.wasPaid = true;
p3.status = ProjectStatus.Approved;

p4.id = 4;
p4.title = 'Casa Roberta';
p4.client = CLIENTS[3]
p4.wasPaid = false;
p4.status = ProjectStatus.Approved;


export const PROJECTS: Project[] = [
    p1, p2, p3, p4
];