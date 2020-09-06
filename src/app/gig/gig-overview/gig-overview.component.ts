import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Gig } from '../../models/gig';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { GigService } from '../services/gig.service';
import { TitleKeyService, TITLEKEYS } from 'src/app/services/title-key.service';
import { Subscription } from 'rxjs';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-gig-overview',
  templateUrl: './gig-overview.component.html',
  styleUrls: ['./gig-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigOverviewComponent implements OnInit, OnDestroy {
  public gigs: Gig[];

  private _subscriptions$: Subscription;

  constructor(
    private _gigService: GigService,
    private _authService: AuthService,
    private _navbarActionService: NavbarActionService,
    private _router: Router
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.createNewGig()
      }
    ]);
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._gigService.getGigsForUser(this._authService.user.uid).subscribe((gigs: Gig[]) => {
        this.gigs = gigs;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public createNewGig(): void {
      this._gigService.removeSelectedGig();
      this._router.navigate(['/gigs/edit', -1]);
  }

  public viewDetails(gig: Gig): void {
    this._gigService.storeSelectedGig(gig);
  }
}
