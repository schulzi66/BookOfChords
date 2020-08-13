import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Configuration } from './../../models/configuration';
import { TitleKeyService, TITLEKEYS } from 'src/app/services/title-key.service';
import { mergeMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-band-overview',
  templateUrl: './band-overview.component.html',
  styleUrls: ['./band-overview.component.scss']
})
export class BandOverviewComponent implements OnInit, OnDestroy {
  private _subscriptions$: Subscription;

  public band: Band;
  public configuration: Configuration;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _configurationService: ConfigurationService,
    private _titleService: TitleKeyService
  ) {
    this._subscriptions$ = new Subscription();
    this._titleService.currentTitleKey = TITLEKEYS.band;
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._authService.user$
        .pipe(
          mergeMap((user: User) => {
            this._subscriptions$.add(
              this._configurationService
                .loadConfigurationForUser(user.uid)
                .pipe(tap((configuration: Configuration) => (this.configuration = configuration)))
                .subscribe()
            );
            if (user.bandId) {
              return this._bandService.getBandByBandId(user.bandId).pipe(tap((band: Band) => (this.band = band)));
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public get isUserInBand(): boolean {
    return this.band !== undefined;
  }
}
