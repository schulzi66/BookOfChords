import { SongSection } from './song-section.model';

export class Song {
    id: string;
    uid: string;
    name: string;
    sections: SongSection[];
    pictures: string[];

    constructor(name: string) {
        this.name = name;
        this.sections = [];
        this.pictures = [];
    }
}
