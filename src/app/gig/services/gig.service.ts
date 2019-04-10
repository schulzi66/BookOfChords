import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Gig } from '../../models/gig';

@Injectable({
  providedIn: 'root'
})
export class GigService {

  public selectedGig: Gig;

  private _angularFirestore: AngularFirestore;

  constructor(angularFirestore: AngularFirestore) {
    this._angularFirestore = angularFirestore;
  }

  public saveGig(gig: Gig): void {
    if (!gig.id) {
      gig.id = this._angularFirestore.createId();
    }
    this._angularFirestore.collection<Gig>('gigs')
      .doc(gig.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(gig))));
  }

  public getGigsForUser(uid: string): Observable<Gig[]> {
    return this._angularFirestore.collection<Gig>('gigs', ref => {
      return ref.where('uid', '==', uid);
    }).valueChanges();
  }

  public storeSelectedGig(gig: Gig): void {
    this.selectedGig = gig;
  }

  public removeSelectedGig(): void {
    this.selectedGig = null;
  }

  public retrieveSelectedGig(): Gig {
    return this.selectedGig;
  }
}
