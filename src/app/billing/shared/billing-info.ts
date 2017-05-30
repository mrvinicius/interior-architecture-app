import { Professional } from './../../core/professional';
import { CreditCardInfo } from './credit-card-info';


export interface BillingInfo {
    professionalId: string;
    description?: string;
    firstName: string;
    lastName: string;
    creditCardInfo: CreditCardInfo;
    value?: number;
    quantity?: number;
    recurringBilling?: boolean;
    planIdentifier?: string;
    expirationDate?: Date;

}
