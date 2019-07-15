export class Configuration {
    uid: string;
    fontSizeHeader: number;
    fontSizeSection: number;
    fontFamily: string;
    useKonzertmeister: boolean;

    constructor(uid: string) {
        this.uid = uid;
        this.useKonzertmeister = true;
    }
}
