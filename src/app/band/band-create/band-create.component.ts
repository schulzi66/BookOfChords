import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-band-create',
  templateUrl: './band-create.component.html',
  styleUrls: ['./band-create.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandCreateComponent implements OnInit {
  private _currentUser: User;

  public band: Band;
  public showUpload: boolean = false;

  public constructor(
    private _authService: AuthService,
    private _bandService: BandService,
    private _navbarActionService: NavbarActionService,
    private _activatedRoute: ActivatedRoute
  ) {
    //   if (this._activatedRoute.snapshot.data {; }
    this.band = new Band();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => this.saveBand()
      },
      {
        order: 200,
        icon: 'attach_file',
        action: () => {
          this.showUpload = !this.showUpload;
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
      this._currentUser.bandId = this._bandService.saveBand(this.band);
      this._authService.updateBandIdForUserId(this._currentUser.uid, this._currentUser.bandId);
      this._navbarActionService.resetActions();
    }
  }

  public onImageUploadCompleted($event: string): void {
    this.band.pictureUrl = $event;
  }
}
