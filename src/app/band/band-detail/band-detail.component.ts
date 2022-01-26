import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { BandService } from '../services/band.service';

@Component({
  selector: 'app-band-detail',
  templateUrl: './band-detail.component.html',
  styleUrls: ['./band-detail.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandDetailComponent extends SubscriptionHandler implements OnInit {
  private _currentUser: User;

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
    private _matDialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
    this.band = this._bandService.selectedBand;
    if (this.isUserBandAdmin) {
      this._navbarActionService.registerActions([
        {
          order: 100,
          icon: 'edit',
          action: () => this._router.navigate(['band/edit', this.band.id])
        },
        {
          order: 200,
          icon: 'view_list',
          action: () => {
            this._bandService.selectedBand = null;
            this._router.navigate(['band/selection']);
          }
        }
      ]);
    } else {
      this._navbarActionService.registerActions([
        {
          order: 100,
          icon: 'delete_sweep',
          action: () => {
            this.leaveBand();
          }
        },
        {
          order: 200,
          icon: 'view_list',
          action: () => {
            this._bandService.selectedBand = null;
            this._router.navigate(['band/selection']);
          }
        }
      ]);
    }
  }

  private leaveBand(): void {
    const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
      data: {
        title: translate<string>('leave_band_title'),
        content: translate<string>('leave_band_content', { value: this.band.name })
      }
    });

    this._subscriptions$.add(
      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this._bandService.leaveBand(this.band, this._currentUser.uid);
          this._currentUser.bandIds.splice(this._currentUser.bandIds.indexOf(this.band.id), 1);
          this._authService.updateBandIdsForUserId(this._currentUser.uid, this._currentUser.bandIds);
          this._bandService.selectedBand = null;
          this._router.navigate(['band/selection']);
        }
      })
    );
  }
}
