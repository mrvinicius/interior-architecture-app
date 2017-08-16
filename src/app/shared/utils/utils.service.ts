import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
    public static readonly estados: string[] = [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO'
    ]

    public static readonly addressNumberMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static readonly bankAccountAgencyMask = [/\d/, /\d/, /\d/, /\d/];
    public static readonly bankAccountNumberMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static readonly cardVerificationCode = [/\d/, /\d/, /\d/, /\d/];
    public static readonly cauMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    public static readonly celularMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    public static readonly cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
    public static readonly cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    public static readonly cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    public static readonly creditCardNumberMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

    constructor() { }

    public static getHash(hashLength?: number) {
        let text = "";
        let possible = "0123456789";
        let outputLength = 5;
        if (hashLength) outputLength = hashLength;

        for (var i = 0; i < outputLength; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    public static isCpfCnpj(cpfCnpj: string): boolean {
        var re = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
        // return re.test(cpfCnpj);l // TODO: Reativar
        return true;
    }

    public static isEmail(email: string): boolean {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    public static removeSpaces(str: string): string {
        str = str.trim();
        return str.replace(/ /g, '');
    }

    public static replaceSpecialChars(str: string): string {
        str = str.replace(/[ÀÁÂÃÄÅ]/g, "A");
        str = str.replace(/[ÈÉÊËẼ]/g, "E");
        str = str.replace(/[ÌÍ]/g, "I");
        str = str.replace(/[ÒÓÕÔ]/g, "O");
        str = str.replace(/[ÙÚÛŨÜ]/g, "U");

        str = str.replace(/[àáâãäå]/g, "a");
        str = str.replace(/[èéêëẽ]/g, "e");
        str = str.replace(/[ìí]/g, "i");
        str = str.replace(/[òóõô]/g, "o");
        str = str.replace(/[ùúũûü]/g, "u");

        str = str.replace(/[Ç]/g, "C");
        str = str.replace(/[ç]/g, "c");

        return str;
    }

    public static slugify(str: string): string {
        const f = 'ãàáäâèéêëẽìíïîòóöôùúũûüñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
        const t = 'aaaaaeeeeeiiiioooouuuuuncsyoarsnpwgnmuxzh------'
        const p = new RegExp(f.split('').join('|'), 'g')

        return str.toLowerCase().trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(p, c =>
                t.charAt(f.indexOf(c)))     // Replace special chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');         // Replace multiple - with single
    }

    public static unslug(str): string {
        str = str.replace();

        return str;
    }

    public static getEnumKeyValue(e: any): any {
        let keyValue: any = {};

        for (var member in e) {
            if (typeof e[member] === 'string') {
                keyValue[member] = e[member]
            }
        }

        return keyValue;
    }

    public static getEnumArray(e: any): any[] {
        let array: any = [];

        for (var member in e) {
            if (typeof e[member] === 'string') {
                array.push(e[member])
            }
        }

        return array;
    }

    public static parseMonetaryString(value: string): number {
        value = String(value)

        value = value
            .replace(' ', '')
            .replace('R$', '')
            .replace(/[.]/g, '')
            .replace(/[,]/g, '.');

        return parseFloat(value);
    }

    public static parseKilogramString(value: string): number {
        value = String(value)

        value = value
            .replace(' ', '')
            .replace('kg', '')
            .replace(/[.]/g, '')
            .replace(/[,]/g, '.');

        return parseFloat(value);
    }
}