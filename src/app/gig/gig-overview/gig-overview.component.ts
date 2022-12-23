import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Gig } from '../../models/gig';
import { GigService } from '../services/gig.service';

@Component({
  selector: 'app-gig-overview',
  standalone: true,
  imports: [CommonModule, MatDividerModule, RouterModule, MatButtonModule, MatListModule],
  templateUrl: './gig-overview.component.html',
  styleUrls: ['./gig-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigOverviewComponent extends SubscriptionHandler implements OnInit {
  public gigs: Gig[];

  constructor(
    private _gigService: GigService,
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
      this._gigService.gigs$.subscribe((gigs: Gig[]) => {
        this.gigs = gigs;
      })
    );
  }

  public createNewGig(): void {
    this._router.navigate(['/gigs/edit', -1]);
  }
}
