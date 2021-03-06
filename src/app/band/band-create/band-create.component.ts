import { UploadResult } from 'src/app/models/upload-result';
import { BottomSheetUploaderService } from './../../services/bottom-sheet-uploader.service';
import { translate } from '@ngneat/transloco';
import { SnackbarService } from './../../services/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { MediaTypes } from 'src/app/models/media-types.enum';

@Component({
  selector: 'app-band-create',
  templateUrl: './band-create.component.html',
  styleUrls: ['./band-create.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandCreateComponent implements OnInit {
  private _currentUser: User;

  public band: Band;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _bottomSheetUploaderService: BottomSheetUploaderService
  ) {
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
          this._bottomSheetUploaderService.show({
            storageBucketPrefix: 'bands',
            typesToUpload: [MediaTypes.IMAGE],
            onUploadCallback: (result) => (this.band.pictureUrl = result.downloadUrl)
          });
        }
      }
    ]);
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this.band.adminId = this._currentUser.uid;
  }

  public saveBand(): void {
    if (this.band.name) {
      this.band.members.push(this._currentUser);
      this._bandService.saveBand(this.band).then((bandId: string) => {
        this._currentUser.bandId = bandId;
        this._snackbarService.show({
          message: translate<string>('saved')
        });
        this._authService.updateBandIdForUserId(this._currentUser.uid, this._currentUser.bandId);
        this._navbarActionService.resetActions();
      });
    }
  }
}
