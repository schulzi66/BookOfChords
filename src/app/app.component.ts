import { TitleKeyService } from './services/title-key.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate, TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { PwaService } from './services/pwa.service';
import { RockNRollSnackbarComponent } from './shared/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _subscriptions$: Subscription;
  constructor(
    public authService: AuthService,
    public pwaService: PwaService,
    private _configurationService: ConfigurationService,
    private _translocoService: TranslocoService,
    private _messagingService: MessagingService,
    private _snackbar: MatSnackBar,
    public titleService: TitleKeyService
  ) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit(): void {
    this._subscriptions$.add(
      this._configurationService.configuration$.subscribe((configuration: Configuration) => {
        this._translocoService.setActiveLang(configuration.lang);
      })
    );
    this._messagingService.getPermission(this.authService.user);
    this._messagingService.monitorRefresh(this.authService.user);
    this._messagingService.receiveMessages();
    this._messagingService.currentMessage$.subscribe((message) => {
      this._snackbar.openFromComponent(RockNRollSnackbarComponent, {
        data: {
          message: translate<string>('notification_data'),
          route: 'band'
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
