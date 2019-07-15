import { Component, OnInit } from '@angular/core';
import { Gig } from '../../models/gig';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { GigService } from '../services/gig.service';

@Component({
	selector: 'app-gig-overview',
	templateUrl: './gig-overview.component.html',
	styleUrls: [ './gig-overview.component.scss' ]
})
export class GigOverviewComponent implements OnInit {
	private _gigService: GigService;
	private _authService: AuthService;

	public gigs: Gig[];

	constructor(gigService: GigService, authService: AuthService) {
		this._gigService = gigService;
		this._authService = authService;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._gigService.getGigsForUser(user.uid).subscribe((gigs: Gig[]) => {
				this.gigs = gigs;
			});
		});
	}

	public createNewGig(): void {
		this._gigService.removeSelectedGig();
	}

	public editGig(gig: Gig): void {
		this._gigService.storeSelectedGig(gig);
	}
}
