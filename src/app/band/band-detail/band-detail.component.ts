import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BandService } from '../services/band.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-band-detail',
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandDetailComponent implements OnInit, OnDestroy {
  private _currentUser: User;

  private _subscriptions$: Subscription;

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
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this._subscriptions$ = new Subscription();
    this._subscriptions$.add(
      this._bandService.band$.subscribe((band: Band) => {
        this.band = band;
        if (this.isUserBandAdmin) {
          this._navbarActionService.registerActions([
            {
              order: 100,
              icon: 'edit',
              action: () => this._router.navigate(['band/edit', this.band.id])
            }
          ]);
        }
      })
    );
  }

  ngOnInit(): void {
    this._currentUser = this._authService.user;
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
}
