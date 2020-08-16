export class Configuration {
  uid: string;
  fontSizeHeader: number;
  fontSizeSection: number;
  fontFamily: string;
  useKonzertmeister: boolean;
  lang: string;

  constructor(uid: string) {
    this.uid = uid;
    this.useKonzertmeister = true;
    this.lang = 'en';
  }
}
