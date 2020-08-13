import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Song } from '../../models/song';

@Injectable({ providedIn: 'root' })
export class SongService {
  public selectedSong: Song;

  private _angularFirestore: AngularFirestore;
  constructor(angularFirestore: AngularFirestore) {
    this._angularFirestore = angularFirestore;
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

  public storeSelectedSong(song: Song): void {
    this.selectedSong = song;
  }
  public removeSelectedSong(): void {
    this.selectedSong = null;
  }

  public retrieveSelectedSong(): Song {
    return this.selectedSong;
  }
}
