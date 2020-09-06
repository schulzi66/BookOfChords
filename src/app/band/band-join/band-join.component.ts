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
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-band-join',
  templateUrl: './band-join.component.html',
  styleUrls: ['./band-join.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandJoinComponent implements OnInit, OnDestroy {
  private _currentUser: User;
  private _popupDialogData: PopupDialogData;
  private _subscriptions$: Subscription;

  public bandId: string;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _matDialog: MatDialog,
    private _navbarActionService: NavbarActionService
  ) {
    this._subscriptions$ = new Subscription();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'person_add',
        action: () => this.joinBand()
      }
    ]);
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public joinBand(): void {
    if (this.bandId) {
      this._subscriptions$.add(
        this._bandService.band$.subscribe((band) => {
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
      );
    }
  }
}
