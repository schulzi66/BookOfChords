import { SongSection } from './song-section';

export class Song {
    id: string;
    customId: string;
    uid: string;
    name: string;
    sections: SongSection[];
    bpm: number;
    pictures: string[];
    pdfs: string[];
    sound: string;
    bandId: string;
    isArchived: boolean;

    constructor(name: string) {
        this.name = name;
        this.sections = [];
        this.pictures = [];
        this.pdfs = [];
    }
}
