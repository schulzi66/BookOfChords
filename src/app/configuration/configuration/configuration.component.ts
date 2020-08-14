import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TitleKeyService, TITLEKEYS } from 'src/app/services/title-key.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  private _subscriptions$: Subscription;

  public configuration: Configuration;

  constructor(
    private _configurationService: ConfigurationService,
    private _authService: AuthService,
    private _location: Location,
    private _translocoService: TranslocoService,
    private _titleService: TitleKeyService
  ) {
    this._subscriptions$ = new Subscription();
    this._titleService.currentTitleKey = TITLEKEYS.configuration;
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._configurationService.configuration$.subscribe((configuration: Configuration) => {
        if (configuration === undefined) {
          this.configuration = new Configuration(this._authService.user.uid);
        } else {
          this.configuration = configuration;
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
    this._configurationService.saveConfigurationForUser(this.configuration);
  }

  public fontSizeSectionChanged(event: MatSelectChange): void {
    this.configuration.fontSizeSection = event.value;
    this._configurationService.saveConfigurationForUser(this.configuration);
  }

  public fontFamilyChanged(event: MatSelectChange): void {
    this.configuration.fontFamily = event.value;
    this._configurationService.saveConfigurationForUser(this.configuration);
  }

  public useKonzertmeisterChanged(event: MatSlideToggleChange): void {
    this.configuration.useKonzertmeister = event.checked;
    this._configurationService.saveConfigurationForUser(this.configuration);
  }

  public langChanged(event: MatSelectChange): void {
    this.configuration.lang = event.value;
    this._configurationService.saveConfigurationForUser(this.configuration);
  }

  public goBack(): void {
    this._location.back();
  }
}
