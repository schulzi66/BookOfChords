import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';
import { User } from 'src/app/models/user';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  public band$: Observable<Band> = of(undefined);
  public band: Band;

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    if (this._authService.user.bandId) {
      this.band$ = this.getBandByBandId(this._authService.user.bandId);
      this.band$.subscribe((band: Band) => (this.band = band));
    }
  }

  public saveBand(band: Band): Promise<string> {
    if (!band.id) {
      band.id = this._angularFirestore.createId();
    }
    return this._angularFirestore
      .collection('bands')
      .doc(band.id)
      .set(Object.assign({}, JSON.parse(JSON.stringify(band))))
      .then(() => {
        return new Promise<string>((resolve) => {
          this.band$ = of(band);
          resolve(band.id);
        });
      });
  }

  public saveSetlistForBand(band: Band, setlist: Setlist): Promise<string> {
    if (setlist.id === undefined) {
      setlist.id = this._angularFirestore.createId();
      band.setlists.push(setlist);
    }
    return this.saveBand(band);
  }

  public getBandForCurrentUser(): Observable<Band> {
    return this.getBandByBandId(this._authService.user.bandId);
  }

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
