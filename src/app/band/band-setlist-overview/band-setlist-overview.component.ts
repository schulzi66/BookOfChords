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
    if (this._authService.user.bandId) {
      this._subscriptions$.add(
        this._bandService.band$.subscribe((band: Band) => {
          this.band = band;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
}
