import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class BandService {
    public bandsSubject: BehaviorSubject<Array<Band>>;
    public get bands$(): Observable<Array<Band>> {
        return this.bandsSubject.asObservable();
    }
    public bands: Array<Band>;

    public selectedBand: Band;

    constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
        this.bandsSubject = new BehaviorSubject([]);
        this.bands = [];
        this.selectedBand = null;
        this.bands$.subscribe((bands: Array<Band>) => {
            this.bands = bands;
        });
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
                return new Promise<string>(resolve => {
                    this.selectedBand = band;
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

    public getBands(): Observable<Array<Band>> {
        if (this.bands.length > 0) {
            return this.bands$;
        }

        if (this._authService.user.bandIds) {
            return this.getBandsByBandIds(this._authService.user.bandIds).pipe(
                switchMap((bands: Array<Band>) => {
                    this.bandsSubject.next(bands);
                    return of(bands);
                }),
            );
        }
    }

    public getBandByBandId(bandId: string): Observable<Band> {
        return this._angularFirestore
            .collection<Band>('bands', ref => {
                return ref.where('id', '==', bandId);
            })
            .valueChanges()
            .pipe(
                map(band => {
                    return band[0];
                }),
            );
    }

    public getBandsByBandIds(bandIds: Array<string>): Observable<Array<Band>> {
        if (bandIds.length > 0) {
            return this._angularFirestore
                .collection<Band>('bands', ref => {
                    return ref.where('id', 'in', bandIds);
                })
                .valueChanges();
        } else {
            return of([]);
        }
    }

    public deleteBand(bandId: string): Promise<void> {
        return this._angularFirestore.collection<Band>('bands').doc<Band>(bandId).delete();
    }

    public leaveBand(band: Band, userId: string): void {
        if (band && userId) {
            band.members.splice(
                band.members.findIndex(x => x.uid === userId),
                1,
            );
            this.bands.splice(
                this.bands.findIndex(x => x.id === band.id),
                1,
            );
            this.bandsSubject.next(this.bands);
            this._angularFirestore
                .collection<Band>('bands')
                .doc<Band>(band.id)
                .set(Object.assign({}, JSON.parse(JSON.stringify(band))));
        }
    }
}
