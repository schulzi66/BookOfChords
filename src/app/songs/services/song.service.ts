import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, of } from 'rxjs';
import { Song } from '../../models/song';
import { User } from 'src/app/models/user';

@Injectable({ providedIn: 'root' })
export class SongService implements OnDestroy {
  private _subscriptions$: Subscription;

  public selectedSong: Song;

  public songs$: Observable<Song[]>;
  public songs: Song[];

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    this._subscriptions$ = new Subscription();

    this.songs$ = this.getSongsForUser(this._authService.user.uid);

    this._subscriptions$.add(this.songs$.subscribe((songs: Song[]) => (this.songs = songs)));
  }

  ngOnDestroy(): void {
    this.songs$ = null;
    this._subscriptions$.unsubscribe();
  }

  public saveSong(song: Song): void {
    if (!song.id) {
      song.id = this._angularFirestore.createId();
    }
    song.name = song.name.trim();
    this._angularFirestore
      .collection('songs')
      .doc(song.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(song))));
  }

  public getSongsForUser(uid: string): Observable<Song[]> {
    return this._angularFirestore
      .collection<Song>('songs', (ref) => {
        return ref.where('uid', '==', uid).orderBy('name', 'asc');
      })
      .valueChanges();
  }

  public deleteSong(songId: string): Promise<void> {
    return this._angularFirestore.collection<Song>('songs').doc(songId).delete();
  }

  public updateAllSongDocs() {
    // const sub = this._angularFirestore
    // 	.collection<Song>('songs')
    // 	.snapshotChanges()
    // 	.pipe(
    // 		map((changes) => {
    // 			return changes.map((action) => {
    // 				const data = action.payload.doc.data();
    // 				const id = action.payload.doc.id;
    // 				return { id, ...data };
    // 			});
    // 		})
    // 	)
    // 	.subscribe((items) => {
    // 		items.forEach((song) => {
    // 			console.log(song);
    // 			song.name = song.name.trim();
    // 			this._angularFirestore.doc(`songs/${song.id}`).update({ name: song.name });
    // 			// this._angularFirestore.doc(`songs/${song.id}`)
    // 			//                       .update({uid: 'e6Us6fvl2ZTPqJ3tFz4lP1IYVAo1'});
    // 		});
    // 		sub.unsubscribe();
    // 	});
  }
}
