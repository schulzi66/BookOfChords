import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { DeletePopupDialogData } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog-data';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { BandService } from '../services/band.service';

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
    private _navbarActionService: NavbarActionService,
    private _router: Router
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
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
  }

  public joinBand(): void {
    if (this.bandId) {
      this._subscriptions$.add(
        this._bandService.getBandByBandId(this.bandId).subscribe((band: Band) => {
          if (band) {
            if (this._currentUser.bandIds.find((id: string) => band.id === id) === undefined) {
              this._authService.updateBandIdsForUserId(this._currentUser.uid, [
                ...(this._currentUser.bandIds ?? []),
                band.id
              ]);
            }
            if (band.members.find((user: User) => user.uid === this._currentUser.uid) === undefined) {
              band.members.push(this._currentUser);
            }
            this._bandService.bandsSubject.next([...this._bandService.bands, band]);
            this._bandService.saveBand(band);
            this._bandService.selectedBand = band;
            this._router.navigate(['band']);
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
