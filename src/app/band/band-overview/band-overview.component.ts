import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-band-overview',
	templateUrl: './band-overview.component.html',
	styleUrls: [ './band-overview.component.scss' ]
})
export class BandOverviewComponent implements OnInit {
	private _authService: AuthService;
	private _bandService: BandService;

	public band: Band;

	constructor(authService: AuthService, bandService: BandService) {
		this._authService = authService;
		this._bandService = bandService;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			if (user.bandId) {
				this._bandService.getBandByBandId(user.bandId).subscribe((band: Band) => {
					this.band = band;
				});
			}
		});
	}

	public get isUserInBand(): boolean {
		return this.band !== undefined;
	}
}
