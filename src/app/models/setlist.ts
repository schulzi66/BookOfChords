export class Setlist {
    id: string;
    name: string;
    description: string;
    songs: string[];
    pdfUrl: string;

    public constructor() {
        this.description = '';
        this.songs = [];
    }
}
