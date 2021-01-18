import { SnackbarService } from './services/snackbar.service';
import { TitleKeyService } from './services/title-key.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { translate, TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { PwaService } from './services/pwa.service';
import { DrawerActionService } from './services/drawer-action.service';
import { MatDrawer } from '@angular/material/sidenav';
import { NavbarActionService } from './services/navbar-action.service';
import { SubscriptionHandler } from './shared/helper/subscription-handler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionHandler implements OnInit, AfterViewInit {
  @ViewChild('drawer') private _drawer: MatDrawer;

  constructor(
    public authService: AuthService,
    public pwaService: PwaService,
    public titleService: TitleKeyService,
    public navbarActionService: NavbarActionService,
    public drawerActionService: DrawerActionService,
    public configurationService: ConfigurationService,
    private _translocoService: TranslocoService,
    private _messagingService: MessagingService,
    private _snackbarService: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this._subscriptions$.add(
      this.authService.user$.subscribe((user: User) => {
        this._messagingService.getPermission(user);
        this._messagingService.monitorRefresh(user);
        this._messagingService.receiveMessages();
        this._messagingService.currentMessage$.subscribe(() => {
          this._snackbarService.show({ message: translate<string>('notification_data'), route: 'band' });
        });

        this._subscriptions$.add(
          this.configurationService.configuration$.subscribe((configuration: Configuration) => {
            if (configuration) {
              this._translocoService.setActiveLang(configuration.lang);
            }
          })
        );
      })
    );
  }

  ngAfterViewInit(): void {
    this.drawerActionService.drawer = this._drawer;
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
