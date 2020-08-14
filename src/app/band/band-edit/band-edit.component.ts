import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-band-edit',
  templateUrl: './band-edit.component.html',
  styleUrls: ['./band-edit.component.scss']
})
export class BandEditComponent implements OnInit, OnDestroy {
  private _subscriptions$: Subscription;
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
    private _location: Location
  ) {
    this._subscriptions$ = new Subscription();
    this.band = new Band();
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this._subscriptions$.add(
      this._activatedRoute.params.subscribe((params: { id: string }) => {
        if (params.id === this._currentUser.bandId) {
          this._subscriptions$.add(this._bandService.band$.subscribe((band: Band) => (this.band = band)));
        } else {
          this._location.back();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  public deleteMember(i: number): void {
    this.band.members.splice(i, 1);
  }

  public onImageUploadCompleted($event: string): void {
    this.band.pictureUrl = $event;
  }

  public goBack(): void {
    this._bandService.saveBand(this.band);
    this._location.back();
  }
}
