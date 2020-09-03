import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { Configuration } from './../../models/configuration';
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

  public constructor(public bandService: BandService, private _activatedRoute: ActivatedRoute) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this.bandService.band$.subscribe((band: Band) => {
        this.band = band;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public get isUserInBand(): boolean {
    // this.;
    // return this._activatedRoute.snapshot.data['band'] !== undefined;
    return this.band !== undefined;
  }
}
