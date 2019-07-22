import { Component, OnInit } from '@angular/core';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BandService } from '../services/band.service';

@Component({
	selector: 'app-band-detail',
	templateUrl: './band-detail.component.html',
	styleUrls: [ './band-detail.component.scss' ]
})
export class BandDetailComponent implements OnInit {
	private _bandService: BandService;
	private _authService: AuthService;
	private _currentUser: User;

	public band: Band;

	public get isUserBandAdmin(): boolean {
		if (this.band && this._currentUser) {
			return this.band.adminId === this._currentUser.uid;
		} else {
			return false;
		}
	}

	public constructor(authService: AuthService, bandService: BandService) {
		this._authService = authService;
		this._bandService = bandService;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
			if (user.bandId) {
				this._bandService.getBandByBandId(user.bandId).subscribe((band: Band) => {
					this.band = band;
				});
			}
		});
	}
}
