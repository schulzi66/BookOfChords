import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Stats } from '../models/stats';

@Injectable({ providedIn: 'root' })
export class StatsService {
    constructor(private _angularFirestore: AngularFirestore) {}

    public saveStats(stats: Stats): Promise<void> {
        if (!stats.id) {
            stats.id = this._angularFirestore.createId();
        }

        return this._angularFirestore
            .collection('stats')
            .doc(stats.id)
            .set(Object.assign({}, JSON.parse(JSON.stringify(stats))));
    }
}
