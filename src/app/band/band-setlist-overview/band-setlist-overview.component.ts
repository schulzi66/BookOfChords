import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { Router } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-band-setlist-overview',
  templateUrl: './band-setlist-overview.component.html',
  styleUrls: ['./band-setlist-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandSetlistOverviewComponent extends SubscriptionHandler implements OnInit {
  public band: Band;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _navbarActionService: NavbarActionService,
    private _router: Router
  ) {
    super();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this._router.navigate(['./band/setlist/edit', -1])
      }
    ]);
  }

  ngOnInit() {
    if (this._authService.user.bandId) {
      this._subscriptions$.add(
        this._bandService.band$.subscribe((band: Band) => {
          this.band = band;
        })
      );
    }
  }
}
