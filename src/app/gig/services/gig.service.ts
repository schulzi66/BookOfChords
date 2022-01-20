import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';

@Injectable({
  providedIn: 'root'
})
export class GigService {
  public gigs$: Observable<Gig[]>;

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    this.gigs$ = this.getGigsForUser(this._authService.user.uid);
  }

  public saveGig(gig: Gig): Promise<void> {
    if (!gig.id) {
      gig.id = this._angularFirestore.createId();
    }
    return this._angularFirestore
      .collection<Gig>('gigs')
      .doc(gig.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(gig))));
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

  private getGigsForUser(uid: string): Observable<Gig[]> {
    return this._angularFirestore
      .collection<Gig>('gigs', (ref) => {
        return ref.where('uid', '==', uid).orderBy('name', 'asc');
      })
      .valueChanges();
  }
}
