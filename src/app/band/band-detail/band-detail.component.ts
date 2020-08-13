import { Component, OnInit, OnDestroy } from '@angular/core';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BandService } from '../services/band.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-band-detail',
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss']
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

  public constructor(private _authService: AuthService, private _bandService: BandService) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._authService.user$
        .pipe(
          tap((user: User) => {
            this._currentUser = user;
            if (user.bandId) {
              this._subscriptions$.add(
                this._bandService
                  .getBandByBandId(user.bandId)
                  .pipe(tap((band: Band) => (this.band = band)))
                  .subscribe()
              );
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
}
