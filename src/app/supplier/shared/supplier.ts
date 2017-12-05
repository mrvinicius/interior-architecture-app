import { Store } from '../shared/store';

export interface Supplier {
    id: string;
    name: string;
    defaultEmail: string;
    stores: Store[];
}
