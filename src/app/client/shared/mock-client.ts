import { Client } from './client';

let c1 = new Client(),
    c2 = new Client(),
    c3 = new Client(),
    c4 = new Client();

c1.id = 1;
c1.name = 'Maria Joaquina';

c2.id = 2;
c2.name = 'Antônio Carlos';

c3.id = 3;
c3.name = 'Roberta Miranda';

c4.id = 4;
c4.name = 'Roberta Silva';

export const CLIENTS: Client[] = [
    c1, c2, c3, c4
]