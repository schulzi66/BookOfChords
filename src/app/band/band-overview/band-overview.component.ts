import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { Configuration } from './../../models/configuration';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
@Component({
  selector: 'app-band-overview',
  templateUrl: './band-overview.component.html',
  styleUrls: ['./band-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandOverviewComponent extends SubscriptionHandler implements OnInit {
  public band: Band;
  public configuration: Configuration;

  public constructor(public bandService: BandService) {
    super();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this.bandService.band$.subscribe((band: Band) => {
        this.band = band;
      })
    );
  }

  public get isUserInBand(): boolean {
    // this.;
    // return this._activatedRoute.snapshot.data['band'] !== undefined;
    return this.band !== undefined;
  }
}
