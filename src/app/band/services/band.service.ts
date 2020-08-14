import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class BandService implements OnDestroy {
  private _subscriptions$: Subscription;

  public band$: Observable<Band> = of(null);

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    this._subscriptions$ = new Subscription();
    this._subscriptions$.add(
      this._authService.user$.subscribe((user: User) => {
        if (user.bandId) {
          this.band$ = this.getBandByBandId(user.bandId);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.band$ = null;
    this._subscriptions$.unsubscribe();
  }

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

  private getBandByBandId(bandId: string): Observable<Band> {
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
