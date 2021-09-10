import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Band } from 'src/app/models/band';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { BandService } from '../services/band.service';

@Component({
  selector: 'app-band-selection',
  templateUrl: './band-selection.component.html',
  styleUrls: ['./band-selection.component.scss']
})
export class BandSelectionComponent extends SubscriptionHandler implements OnInit {
  public bands: Array<Band>;

  public constructor(
    public bandService: BandService,
    private _router: Router,
    private _navbarActionService: NavbarActionService
  ) {
    super();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this._router.navigate(['./band/noband'])
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(
      this.bandService.bands$.subscribe((bands: Array<Band>) => {
        this.bands = bands;
      })
    );
  }

  public onBandSelected(band: Band): void {
    this.bandService.selectedBand = band;
    this._router.navigate(['band']);
  }
}
