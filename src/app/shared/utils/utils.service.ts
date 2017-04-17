import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() { }

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