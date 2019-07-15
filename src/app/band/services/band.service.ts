import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Band } from 'src/app/models/band';

@Injectable({
	providedIn: 'root'
})
export class BandService {
	private _angularFirestore: AngularFirestore;

	constructor(angularFirestore: AngularFirestore) {
		this._angularFirestore = angularFirestore;
	}

	// public update(user: User) {
	// 	let band: Band = {
	// 		id: '8Zkohzqiq8ja2AW4yx9x',
	// 		adminId: user.uid,
	// 		name: 'test',
	// 		pictureUrl: '',
	// 		members: [],
	// 		setlists: []
	// 	};
	// 	band.members.push(user);
	// 	band.setlists.push(new Setlist());
	// 	this._angularFirestore
	// 		.collection<Band>('bands')
	// 		.doc(`8Zkohzqiq8ja2AW4yx9x`)
	// 		.set(Object.assign({}, JSON.parse(JSON.stringify(band))));
	// }

	public getBandByBandId(bandId: string): Observable<Band> {
		return this._angularFirestore
			.collection<Band>('bands', (ref) => {
				return ref.where('id', '==', bandId);
			})
			.valueChanges()
			.pipe(
				map((band) => {
					return band[0];
				})
			);
	}
}
