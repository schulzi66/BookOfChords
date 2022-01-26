import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-band-edit',
  templateUrl: './band-edit.component.html',
  styleUrls: ['./band-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandEditComponent extends SubscriptionHandler implements OnInit {
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
    private _activatedRoute: ActivatedRoute,
    private _bandService: BandService,
    private _authService: AuthService,
    private _location: Location,
    private _matDialog: MatDialog,
    private _router: Router,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _bottomSheetService: BottomSheetService
  ) {
    super();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () =>
          this._bandService.saveBand(this.band).then((_: string) => {
            this._snackbarService.show({
              message: translate<string>('saved')
            });
          })
      },
      {
        order: 200,
        icon: 'upload_file',
        action: () => {
          const bottomSheetRef: MatBottomSheetRef = this._bottomSheetService.showUpload({
            storageBucketPrefix: 'bands',
            typesToUpload: [MediaTypes.IMAGE],
            onUploadCallback: (result) => {
              this.band.pictureUrl = result.downloadUrl;
              bottomSheetRef.dismiss();
            }
          });
        }
      },
      {
        order: 300,
        icon: 'delete_outline',
        action: () => {
          this.deleteBand();
        }
      }
    ]);
    this.band = new Band();
  }

  ngOnInit() {
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
    this._subscriptions$.add(
      this._activatedRoute.params.subscribe((params: { id: string }) => {
        if (this._currentUser.bandIds.includes(params.id)) {
          this.band = this._bandService.selectedBand;
        } else {
          this._location.back();
        }
      })
    );
  }

  public deleteMember(i: number): void {
    this.band.members.splice(i, 1);
  }

  public deleteBand(): void {
    const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
      data: {
        title: translate<string>('delete_band_title'),
        content: translate<string>('delete_band_content', { value: this.band.name })
      }
    });

    this._subscriptions$.add(
      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          const x = this._currentUser.bandIds;
          this._currentUser.bandIds.splice(this._currentUser.bandIds.indexOf(this.band.id), 1);
          this._authService.updateBandIdsForUserId(this._currentUser.uid, this._currentUser.bandIds);
          this._bandService.selectedBand = null;
          this._bandService.deleteBand(this.band.id).then(() => {
            this._router.navigate(['./band/selection']);
          });
        }
      })
    );
  }
}
