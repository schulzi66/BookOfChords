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

  public constructor(private _bandService: BandService) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._bandService.band$.subscribe((band: Band) => {
        this.band = band;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public get isUserInBand(): boolean {
    return this.band !== undefined;
  }
}
