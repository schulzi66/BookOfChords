import { Setlist } from './setlist';
import { User } from './user';

export class Band {
	id: string;
	adminId: string;
	name: string;
	pictureUrl: string;
	members: User[];
	setlists: Setlist[];

	constructor() {
		this.members = [];
		this.setlists = [];
	}
}
