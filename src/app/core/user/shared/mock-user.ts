import { User } from './user';
// import { Professional } from '../../../internal/professional/shared/professional';
// import { professionalPartners } from '../../../internal/professional/shared/mock-professional';

// export const currentUser: Professional = {
//     id: 0,
//     email: 'sandro@gmail.com',
//     name: 'Sandro Alves',
//     professionalPartners: professionalPartners,
//     description: 'Os melhores arquitetos e designers de interiores'
// };

export const currentUser: User = {
    id: 0,
    email: 'maria@a.b',
    name: 'Maria Alves',
    password: ''
    // professionalPartners: professionalPartners,
    // description: 'Os melhores arquitetos e designers de interiores'
};

export const users: User[] = [
    {
        id: 1,
        email: 'abc@gmail.com',
        password: '123'
    }
];