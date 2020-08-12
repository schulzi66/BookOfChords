import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { translate, TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { PwaService } from './services/pwa.service';
import { RockNRollSnackbarComponent } from './shared/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string;
  public authService: AuthService;
  public pwaService: PwaService;

  private _configurationService: ConfigurationService;
  private _translocoService: TranslocoService;
  private _messagingService: MessagingService;
  private _snackbar: MatSnackBar;

  constructor(
    authService: AuthService,
    pwaService: PwaService,
    configurationService: ConfigurationService,
    translocoService: TranslocoService,
    messagingService: MessagingService,
    snackbar: MatSnackBar
  ) {
    this.authService = authService;
    this.pwaService = pwaService;
    this._configurationService = configurationService;
    this._translocoService = translocoService;
    this._messagingService = messagingService;
    this._snackbar = snackbar;
  }

  ngOnInit(): void {
    this.title = 'Book of Chords';
    this.authService.user$.subscribe((user: User) => {
      if (user) {
        this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
          this._translocoService.setActiveLang(configuration.lang);
        });
        this._messagingService.getPermission(user);
        this._messagingService.monitorRefresh(user);
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
    });
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
