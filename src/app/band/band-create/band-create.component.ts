import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { BottomSheetService } from '../../services/bottom-sheet.service';
import { SnackbarService } from './../../services/snackbar.service';

@Component({
  selector: 'app-band-create',
  templateUrl: './band-create.component.html',
  styleUrls: ['./band-create.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandCreateComponent extends SubscriptionHandler implements OnInit {
  private _currentUser: User;

  public band: Band;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _bottomSheetService: BottomSheetService,
    private _router: Router
  ) {
    super();
    this.band = new Band();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => this.saveBand()
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
      }
    ]);
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
    this.band.adminId = this._currentUser.uid;
  }

  public saveBand(): void {
    if (this.band.name) {
      this.band.members.push(this._currentUser);
      this._bandService.saveBand(this.band).then((bandId: string) => {
        if (!this._currentUser.bandIds) {
          this._currentUser.bandIds = [];
        }
        this._currentUser.bandIds.push(bandId);
        this._snackbarService.show({
          message: translate<string>('saved')
        });
        this._authService.updateBandIdsForUserId(this._currentUser.uid, this._currentUser.bandIds);
        this._bandService.bandsSubject.next([...this._bandService.bands, this.band]);
        this._navbarActionService.resetActions();
        this._router.navigate(['./band']);
      });
    }
  }
}
