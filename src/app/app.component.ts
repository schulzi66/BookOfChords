import { SnackbarService } from './services/snackbar.service';
import { TitleKeyService } from './services/title-key.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { translate, TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { PwaService } from './services/pwa.service';
import { Subscription } from 'rxjs';
import { DrawerActionService } from './services/drawer-action.service';
import { MatDrawer } from '@angular/material/sidenav';
import { NavbarActionService } from './services/navbar-action.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private _subscriptions$: Subscription;

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
    this._subscriptions$ = new Subscription();
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

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
