import { User } from '../../../core/user/shared/user';

export class Professional extends User {
    description?: string;
    logo?;
    professionalPartners?: Professional[];
}
