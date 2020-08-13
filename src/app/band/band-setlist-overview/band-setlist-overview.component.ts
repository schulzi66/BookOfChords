import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-band-setlist-overview',
  templateUrl: './band-setlist-overview.component.html',
  styleUrls: ['./band-setlist-overview.component.scss']
})
export class BandSetlistOverviewComponent implements OnInit, OnDestroy {
  public band: Band;

  private _subscriptions$: Subscription;

  public constructor(private _authService: AuthService, private _bandService: BandService) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._authService.user$
        .pipe(
          tap((user: User) => {
            if (user.bandId) {
              this._subscriptions$.add(
                this._bandService
                  .getBandByBandId(user.bandId)
                  .pipe(
                    tap((band: Band) => {
                      this.band = band;
                    })
                  )
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
