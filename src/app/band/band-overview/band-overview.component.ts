import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Configuration } from './../../models/configuration';
import { TitleService, TITLEKEYS } from 'src/app/services/title.service';
@Component({
  selector: 'app-band-overview',
  templateUrl: './band-overview.component.html',
  styleUrls: ['./band-overview.component.scss']
})
export class BandOverviewComponent implements OnInit {
  private _authService: AuthService;
  private _bandService: BandService;
  private _configurationService: ConfigurationService;

  public band: Band;
  public configuration: Configuration;

  public constructor(
    authService: AuthService,
    bandService: BandService,
    configurationService: ConfigurationService,
    private _titleService: TitleService
  ) {
    this._authService = authService;
    this._bandService = bandService;
    this._configurationService = configurationService;
  }

  ngOnInit() {
    this._titleService.currentTitleKey = TITLEKEYS.band;
    this._authService.user$.subscribe((user: User) => {
      if (user.bandId) {
        this._bandService.getBandByBandId(user.bandId).subscribe((band: Band) => {
          this.band = band;
        });
      }
      this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
        this.configuration = configuration;
      });
    });
  }

  public get isUserInBand(): boolean {
    return this.band !== undefined;
  }
}
