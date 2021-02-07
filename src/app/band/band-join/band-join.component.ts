import { translate } from '@ngneat/transloco';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DeletePopupDialogData } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog-data';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { BandService } from '../services/band.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-band-join',
  templateUrl: './band-join.component.html',
  styleUrls: ['./band-join.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandJoinComponent extends SubscriptionHandler implements OnInit {
  private _currentUser: User;
  private _popupDialogData: DeletePopupDialogData;

  public bandId: string;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _matDialog: MatDialog,
    private _navbarActionService: NavbarActionService
  ) {
    super();
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
              title: translate<string>('no_band_found_title'),
              content: translate<string>('no_band_found_content', { value: this.bandId })
            };
            this._matDialog.open(DeletePopupDialogComponent, {
              data: this._popupDialogData
            });
          }
        })
      );
    }
  }
}
