import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { BandDetailComponent } from '../band-detail/band-detail.component';
import { BandSetlistOverviewComponent } from '../band-setlist-overview/band-setlist-overview.component';
import { Configuration } from './../../models/configuration';

@Component({
  selector: 'app-band-overview',
  standalone: true,
  imports: [BandDetailComponent, BandSetlistOverviewComponent, MatTabsModule, TranslocoModule],
  templateUrl: './band-overview.component.html',
  styleUrls: ['./band-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandOverviewComponent extends SubscriptionHandler implements OnInit {
  public band: Band;
  public configuration: Configuration;

  public constructor(public bandService: BandService, private _router: Router) {
    super();
    this._subscriptions$.add(
      this.bandService.getBands().subscribe((bands: Array<Band>) => {
        if (bands.length === 0) {
          this._router.navigate(['band/noband']);
          return;
        }
        if (!this.bandService.selectedBand) {
          this._router.navigate(['band/selection']);
          return;
        }
      })
    );
  }

  ngOnInit() {
    this.band = this.bandService.selectedBand;
  }

  public get isUserInBand(): boolean {
    return this.band !== undefined;
  }
}
