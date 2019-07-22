import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';

@Injectable({
	providedIn: 'root'
})
export class BandService {
	private _angularFirestore: AngularFirestore;

	private _currentBand: Band;

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

	public saveBand(band: Band): string {
		if (!band.id) {
			band.id = this._angularFirestore.createId();
		}
		this._angularFirestore
			.collection('bands')
			.doc(band.id)
			.set(Object.assign({}, JSON.parse(JSON.stringify(band))));
		return band.id;
	}

	public saveSetlistForBand(band: Band, setlist: Setlist): void {
		if (setlist.id === undefined) {
			setlist.id = this._angularFirestore.createId();
			band.setlists.push(setlist);
		}
		this.saveBand(band);
	}

	public saveNewSetlistForBand(band: Band, setlist: Setlist): void {
		this._angularFirestore.createId();
	}

	public getBandByBandId(bandId: string): Observable<Band> {
		if (this._currentBand === undefined) {
			return this._angularFirestore
				.collection<Band>('bands', (ref) => {
					return ref.where('id', '==', bandId);
				})
				.valueChanges()
				.pipe(
					map((band) => {
						this._currentBand = band[0];
						return band[0];
					})
				);
		} else {
			return of(this._currentBand);
		}
	}
}
