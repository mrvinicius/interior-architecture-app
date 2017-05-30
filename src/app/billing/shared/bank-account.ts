import { Bank } from './bank';

export class BankAccount {
    id: string;
    bank: Bank;
    agency: string;
    accountNumber: string;
    accountDigit: string;

    constructor(
        agencyNumber?: string | number,
        accountNumber?: string | number,
        accountDigit?: string | number,
        id?: string,
        bank?: Bank,
    ) {
        if (bank !== undefined) this.bank = bank;
        if (agencyNumber !== undefined) this.agency = String(agencyNumber);
        if (accountNumber !== undefined) this.accountNumber = String(accountNumber);
        if (accountDigit !== undefined) this.accountDigit = String(accountDigit);
        if (id !== undefined) this.id = id;
    }
}
