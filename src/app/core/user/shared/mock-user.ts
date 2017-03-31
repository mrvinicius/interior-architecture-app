import { User } from './user';
import { Professional } from '../../../internal/professional/shared/professional';
import { professionalPartners } from '../../../internal/professional/shared/mock-professional';

export const currentUser: Professional = {
    id: 0,
    email: 'sandro@gmail.com',
    name: 'Sandro Alves',
    professionalPartners: professionalPartners,
    description: 'Os melhores arquitetos e designers de interiores'
};