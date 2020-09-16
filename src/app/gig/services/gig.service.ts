import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GigService {
  private _subscriptions$: Subscription;

  public gigs$: Observable<Gig[]>;
  public gigs: Gig[];

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    this._subscriptions$ = new Subscription();
    this.gigs$ = this.getGigsForUser(this._authService.user.uid);

    this._subscriptions$.add(this.gigs$.subscribe((gigs: Gig[]) => (this.gigs = gigs)));
  }

  public saveGig(gig: Gig): void {
    if (!gig.id) {
      gig.id = this._angularFirestore.createId();
    }
    this._angularFirestore
      .collection<Gig>('gigs')
      .doc(gig.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(gig))));
  }

  public getGigsForUser(uid: string): Observable<Gig[]> {
    return this._angularFirestore
      .collection<Gig>('gigs', (ref) => {
        return ref.where('uid', '==', uid);
      })
      .valueChanges();
  }

  public deleteGig(gigId: string): Promise<void> {
    return this._angularFirestore.collection<Gig>('gigs').doc(gigId).delete();
  }

  public updateSongInGigsForUser(uid: string, song: Song): any {
    let gigsToUpdate: Gig[] = [];
    this._angularFirestore
      .collection<Gig>('gigs', (ref) => {
        return ref.where('uid', '==', uid);
      })
      .get()
      .subscribe((x) => {
        const currentGigsState: Gig[] = [];
        x.docs.forEach((doc) => {
          currentGigsState.push(doc.data() as Gig);
        });
        gigsToUpdate = currentGigsState.filter((gig) => gig.songs.filter((y) => y.id === song.id).length > 0);
        gigsToUpdate.forEach((gig) => {
          for (let i = 0; i < gig.songs.length; i++) {
            if (gig.songs[i].id === song.id) {
              gig.songs[i] = song;
            }
          }
        });
        gigsToUpdate.forEach((gig) => {
          this._angularFirestore.doc(`gigs/${gig.id}`).update({ songs: gig.songs });
        });
      });
    }
}
