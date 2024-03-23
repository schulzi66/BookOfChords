export class Configuration {
    uid: string;
    fontSizeHeader: number;
    fontSizeSection: number;
    fontFamily: string;
    useDarkMode: boolean;
    lang: string;
    openDrawerInitially: boolean;
    filterArchivedSongsInitially: boolean;
    sectionAlignment: 'start' | 'center' | 'end';
    showMetronomeInGigs: boolean;
    enableCustomSongId: boolean;

    constructor(uid: string) {
        this.uid = uid;
        this.lang = 'en';
        this.useDarkMode = false;
        this.sectionAlignment = 'center';
    }
}
