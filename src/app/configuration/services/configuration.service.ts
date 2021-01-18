import { SubscriptionHandler } from './../../shared/helper/subscription-handler';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription, of } from 'rxjs';
import { Configuration } from '../../models/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends SubscriptionHandler {
  public configuration$: Observable<Configuration> = of(null);

  public get useDarkMode(): boolean {
    return localStorage.getItem('useDarkMode') === 'true';
  }

  constructor(private _angularFirestore: AngularFirestore, private _authService: AuthService) {
    super();
    this._subscriptions$.add(
      this._authService.user$.subscribe((user) => {
        if (user) {
          this.configuration$ = this.loadConfigurationForUser(user.uid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.configuration$ = null;
    super.ngOnDestroy();
  }

  private loadConfigurationForUser(uid: string): Observable<Configuration> {
    return this._angularFirestore.collection('configurations').doc<Configuration>(uid).valueChanges();
  }

  public saveConfigurationForUser(configuration: Configuration): Promise<void> {
    this.storeThemeSelectionInLocalStorage(configuration.useDarkMode);
    return this._angularFirestore
      .collection('configurations')
      .doc(configuration.uid)
      .set(Object.assign({}, JSON.parse(JSON.stringify(configuration))));
  }

  private storeThemeSelectionInLocalStorage(useDarkMode: boolean): void {
    localStorage.setItem('useDarkMode', String(useDarkMode));
  }
}
