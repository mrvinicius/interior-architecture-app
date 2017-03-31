import { User } from '../../../core/user/shared/user';

export class Professional extends User {
    professionalName?: string;
    description?: string;
    logo?;
    professionalPartners?: Professional[];
}
