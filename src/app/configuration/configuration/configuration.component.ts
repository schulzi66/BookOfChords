import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  private _subscriptions$: Subscription;

  public configuration: Configuration;

  constructor(
    private _configurationService: ConfigurationService,
    private _authService: AuthService,
    private _translocoService: TranslocoService,
    private _navbarActionService: NavbarActionService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => {
          this._configurationService.saveConfigurationForUser(this.configuration);
        }
      }
    ]);
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._configurationService.configuration$.subscribe((configuration: Configuration) => {
        if (configuration === undefined) {
          this.configuration = new Configuration(this._authService.user.uid);
        } else {
          this.configuration = configuration;
          this._configurationService.saveConfigurationForUser(this.configuration);
        }
        this._translocoService.setActiveLang(this.configuration.lang);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public fontSizeHeaderChanged(event: MatSelectChange): void {
    this.configuration.fontSizeHeader = event.value;
  }

  public fontSizeSectionChanged(event: MatSelectChange): void {
    this.configuration.fontSizeSection = event.value;
  }

  public fontFamilyChanged(event: MatSelectChange): void {
    this.configuration.fontFamily = event.value;
  }

  public langChanged(event: MatSelectChange): void {
    this.configuration.lang = event.value;
  }

  public useDarkModeChanged(event: MatSlideToggleChange): void {
    this.configuration.useDarkMode = event.checked;
    this._configurationService.saveConfigurationForUser(this.configuration);
  }
}
