import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-band-edit',
	templateUrl: './band-edit.component.html',
	styleUrls: [ './band-edit.component.scss' ]
})
export class BandEditComponent implements OnInit {
	private _activatedRoute: ActivatedRoute;
	private _bandService: BandService;
	private _authService: AuthService;
	private _currentUser: User;
	private _location: Location;

	public band: Band;

	public get isUserBandAdmin(): boolean {
		if (this.band && this._currentUser) {
			return this.band.adminId === this._currentUser.uid;
		} else {
			return false;
		}
	}

	public constructor(
		activatedRoute: ActivatedRoute,
		bandService: BandService,
		authService: AuthService,
		location: Location
	) {
		this._activatedRoute = activatedRoute;
		this._bandService = bandService;
		this._authService = authService;
		this._location = location;
		this.band = new Band();
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
			this._activatedRoute.params.subscribe((params: { id: string }) => {
				if (params.id === this._currentUser.bandId) {
					this._bandService.getBandByBandId(params.id).subscribe((band: Band) => {
						this.band = band;
					});
				} else {
					this._location.back();
				}
			});
		});
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
