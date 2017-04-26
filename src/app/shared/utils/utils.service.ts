import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() { }

    public static isCpfCnpj(cpfCnpj: string): boolean {
        var re = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
        // return re.test(cpfCnpj);l // TODO: Reativar
        return true;
    }

    public static isEmail(email: string): boolean {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    public static removeSpaces(str): string {
        str = str.trim();
        return str.replace(/ /g, '');
    }

    public static replaceSpecialChars(str): string {
        str = str.replace(/[ÀÁÂÃÄÅ]/g, "A");
        str = str.replace(/[àáâãäå]/g, "a");
        str = str.replace(/[ÈÉÊËẼ]/g, "E");
        str = str.replace(/[èéêëẽ]/g, "e");
        str = str.replace(/[ÌÍ]/g, "I");
        str = str.replace(/[ìí]/g, "i");
        str = str.replace(/[ÒÓÕÔ]/g, "O");
        str = str.replace(/[òóõô]/g, "o");
        str = str.replace(/[ÙÚÛŨÜ]/g, "U");
        str = str.replace(/[ùúũûü]/g, "u");
        str = str.replace(/[Ç]/g, "C");
        str = str.replace(/[ç]/g, "c");

        return str;
    }
}