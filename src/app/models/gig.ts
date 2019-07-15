import { Song } from './song';

export class Gig {
	uid: string;
	id: string;
	name: string;
	songs: Song[];

	constructor(name: string) {
		this.name = name;
		this.songs = [];
	}
}
