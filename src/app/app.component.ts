import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { filter } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from './models/configuration';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { DrawerActionService } from './services/drawer-action.service';
import { MessagingService } from './services/messaging.service';
import { NavbarActionService } from './services/navbar-action.service';
import { PwaService } from './services/pwa.service';
import { SnackbarService } from './services/snackbar.service';
import { TitleKeyService } from './services/title-key.service';
import { SubscriptionHandler } from './shared/helper/subscription-handler';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    TranslocoModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends SubscriptionHandler implements OnInit, AfterViewInit {
  private _initialized: boolean;
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
    this._initialized = false;
  }

  ngOnInit(): void {
    this._subscriptions$.add(
      this.authService.user$.pipe(filter((user) => user != null)).subscribe((user: User) => {
        this._messagingService.getPermission(user);
        this._messagingService.receiveMessages();
        this._messagingService.currentMessage$.subscribe(() => {
          this._snackbarService.show({ message: translate<string>('notification_data'), route: 'band' });
        });

        this._subscriptions$.add(
          this.configurationService.configuration$.subscribe((configuration: Configuration) => {
            if (configuration) {
              this._translocoService.setActiveLang(configuration.lang);

              if (!this._initialized) {
                this._drawer.opened = configuration.openDrawerInitially;
              }

              this._initialized = true;
            }
          })
        );
      })
    );
  }

  ngAfterViewInit(): void {
    this.drawerActionService.drawer = this._drawer;
  }

  public installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }
}
