import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Configuration } from '../../models/configuration.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private _angularFirestore: AngularFirestore;

  // public configuration$: Observable<Configuration>;

  constructor(angularFirestore: AngularFirestore) {
    this._angularFirestore = angularFirestore;    
  }

  public loadConfigurationForUser(uid: string): Observable<Configuration> {
    // this.configuration$ 
    return this._angularFirestore.collection('configurations')
                          .doc<Configuration>(uid)
                          .valueChanges();    
  }

  public saveConfigurationForUser(configuration: Configuration): void {
    this._angularFirestore.collection('configurations')
                          .doc(configuration.uid)
                          .set(Object.assign({}, JSON.parse(JSON.stringify(configuration))));
  }
}
