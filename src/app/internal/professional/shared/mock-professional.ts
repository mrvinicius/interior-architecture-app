import { Professional } from './professional';

export const professionalPartners: Professional[] = [
    {
        id: 1,
        name: 'Bianca Nunes',
        email: 'bianca@gmail.com',
    },
    {
        id: 2,
        name: 'Ana Albuquerque',
        email: 'ana@outlook.com',
    },
    {
        id: 3,
        name: 'Pedro Henrique',
        email: 'pedro.henrique@gmail.com'
    }
];

export const currentProfessional: Professional = {
    id: 0,
    email: 'sandro@gmail.com',
    name: 'Sandro Alves',
    professionalPartners: professionalPartners,
    description: 'Os melhores arquitetos e designers de interiores'
}