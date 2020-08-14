import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, of } from 'rxjs';
import { Configuration } from '../../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService implements OnDestroy {
  private _subscriptions$: Subscription;

  public configuration$: Observable<Configuration> = of(null);

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    this._subscriptions$ = new Subscription();
    this._subscriptions$.add(
      this._authService.user$.subscribe((user) => (this.configuration$ = this.loadConfigurationForUser(user.uid)))
    );
  }

  ngOnDestroy(): void {
    this.configuration$ = null;
    this._subscriptions$.unsubscribe();
  }

  private loadConfigurationForUser(uid: string): Observable<Configuration> {
    return this._angularFirestore.collection('configurations').doc<Configuration>(uid).valueChanges();
  }

  public saveConfigurationForUser(configuration: Configuration): void {
    this._angularFirestore
      .collection('configurations')
      .doc(configuration.uid)
      .set(Object.assign({}, JSON.parse(JSON.stringify(configuration))));
  }
}
