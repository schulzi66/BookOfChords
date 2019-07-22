import { Component, OnInit } from '@angular/core';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-band-setlist-overview',
	templateUrl: './band-setlist-overview.component.html',
	styleUrls: [ './band-setlist-overview.component.scss' ]
})
export class BandSetlistOverviewComponent implements OnInit {
	private _bandService: BandService;
	private _authService: AuthService;
	private _currentUser: User;

	public band: Band;

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

	public createNewSetlist(): void {}

	public editSetlist(setlist: Setlist): void {}
}
