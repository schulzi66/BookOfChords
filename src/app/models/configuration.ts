export class Configuration {
  uid: string;
  fontSizeHeader: number;
  fontSizeSection: number;
  fontFamily: string;
  useDarkMode: boolean;
  lang: string;
  countInBeats: number;

  constructor(uid: string) {
    this.uid = uid;
    this.lang = 'en';
    this.useDarkMode = false;
  }
}
