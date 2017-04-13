import { UserType } from "./user-type.enum";

export class User {
    id?: number;
    email: string;
    name: string;
    password?: string;
    userType?: UserType;
    
    constructor(parameters) {
        
    }
}