import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BandService } from '../services/band.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-band-detail',
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandDetailComponent extends SubscriptionHandler implements OnInit {
  private _currentUser: User;

  public band: Band;

  public get isUserBandAdmin(): boolean {
    if (this.band && this._currentUser) {
      return this.band.adminId === this._currentUser.uid;
    } else {
      return false;
    }
  }

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _navbarActionService: NavbarActionService,
    private _router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.band = this._bandService.selectedBand;
    if (this.isUserBandAdmin) {
      this._navbarActionService.registerActions([
        {
          order: 100,
          icon: 'edit',
          action: () => this._router.navigate(['band/edit', this.band.id])
        }
      ]);
    }
    this._currentUser = this._authService.user;
  }
}
