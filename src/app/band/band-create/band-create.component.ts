import { tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-band-create',
  templateUrl: './band-create.component.html',
  styleUrls: ['./band-create.component.scss']
})
export class BandCreateComponent implements OnInit {
  private _currentUser: User;

  public band: Band;

  public constructor(private _authService: AuthService, private _bandService: BandService) {
    this.band = new Band();
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this.band.adminId = this._currentUser.uid;
  }

  public saveBand(): void {
    this.band.members.push(this._currentUser);
    this._currentUser.bandId = this._bandService.saveBand(this.band);
    this._authService.updateBandIdForUserId(this._currentUser.uid, this._currentUser.bandId);
  }

  public onImageUploadCompleted($event: string): void {
    this.band.pictureUrl = $event;
  }
}
