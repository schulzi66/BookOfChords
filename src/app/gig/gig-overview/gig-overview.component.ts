import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Gig } from '../../models/gig';
import { AuthService } from '../../services/auth.service';
import { GigService } from '../services/gig.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-gig-overview',
  templateUrl: './gig-overview.component.html',
  styleUrls: ['./gig-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigOverviewComponent extends SubscriptionHandler implements OnInit {
  public gigs: Gig[];

  constructor(
    private _gigService: GigService,
    private _authService: AuthService,
    private _navbarActionService: NavbarActionService,
    private _router: Router
  ) {
    super();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.createNewGig()
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._gigService.getGigsForUser(this._authService.user.uid).subscribe((gigs: Gig[]) => {
        this.gigs = gigs;
      })
    );
  }

  public createNewGig(): void {
    this._router.navigate(['/gigs/edit', -1]);
  }
}
