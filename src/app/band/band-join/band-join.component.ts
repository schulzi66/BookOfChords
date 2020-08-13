import { map, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PopupDialogData } from 'src/app/shared/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared/components/popup-dialog/popup-dialog.component';
import { BandService } from '../services/band.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-band-join',
  templateUrl: './band-join.component.html',
  styleUrls: ['./band-join.component.scss']
})
export class BandJoinComponent implements OnInit, OnDestroy {
  private _currentUser: User;
  private _popupDialogData: PopupDialogData;
  private _subscriptions$: Subscription;

  public bandId: string;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _matDialog: MatDialog
  ) {
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._authService.user$
        .pipe(
          tap((user: User) => {
            this._currentUser = user;
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public joinBand(): void {
    this._subscriptions$.add(
      this._bandService
        .getBandByBandId(this.bandId)
        .pipe(
          map((band: Band) => {
            if (band) {
              this._authService.updateBandIdForUserId(this._currentUser.uid, band.id);
              band.members.push(this._currentUser);
              this._bandService.saveBand(band);
            } else {
              this._popupDialogData = {
                title: 'No Band Found',
                content: `We could not find any band with the id: ${this.bandId}.`
              };
              this._matDialog.open(PopupDialogComponent, {
                data: this._popupDialogData
              });
            }
          })
        )
        .subscribe()
    );
  }
}
