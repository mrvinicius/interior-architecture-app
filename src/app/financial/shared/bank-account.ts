import { Bank } from './bank';

export class BankAccount {
    id: string;
    bank: Bank;
    agency: string;
    accountNumber: string;
    accountDigit: string;

    constructor(
        angencyNumber: string | number,
        accountNumber: string | number,
        accountDigit: string | number,
        id?: string,
        bank?: Bank,
    ) {
        this.bank = bank;
        this.agency = String(angencyNumber);
        this.accountNumber = String(accountNumber);
        this.accountDigit = String(accountDigit);
        this.id = id;
    }
}
