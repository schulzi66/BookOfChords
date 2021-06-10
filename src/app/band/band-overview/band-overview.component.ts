import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { Configuration } from './../../models/configuration';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-band-overview',
  templateUrl: './band-overview.component.html',
  styleUrls: ['./band-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandOverviewComponent extends SubscriptionHandler implements OnInit, OnDestroy {
  public band: Band;
  public configuration: Configuration;

  public constructor(public bandService: BandService, private _router: Router) {
    super();
    if (!this.bandService.selectedBand) {
      this._router.navigate(['band/selection']);
    }
  }

  ngOnInit() {
    // this._subscriptions$.add(
    //   this.bandService.band$.subscribe((band: Band) => {
    //     this.band = band;
    //   })
    // );
    this.band = this.bandService.selectedBand;
  }

  ngOnDestroy() {
    this.bandService.selectedBand = null;
  }

  public get isUserInBand(): boolean {
    return this.band !== undefined;
  }
}
