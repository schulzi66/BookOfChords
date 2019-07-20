import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Band } from 'src/app/models/band';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { PopupDialogData } from 'src/app/shared-ui/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared-ui/components/popup-dialog/popup-dialog.component';
import { BandService } from '../services/band.service';

@Component({
	selector: 'app-band-join',
	templateUrl: './band-join.component.html',
	styleUrls: [ './band-join.component.scss' ]
})
export class BandJoinComponent implements OnInit {
	private _authService: AuthService;
	private _bandService: BandService;
	private _currentUser: User;
	private _matDialog: MatDialog;
	private _popupDialogData: PopupDialogData;

	public bandId: string;

	constructor(authService: AuthService, bandService: BandService, matDialog: MatDialog) {
		this._authService = authService;
		this._bandService = bandService;
		this._matDialog = matDialog;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
		});
	}

	public joinBand(): void {
		const subscription = this._bandService.getBandByBandId(this.bandId).subscribe((band: Band) => {
			if (band) {
				this._authService.updateBandIdForUserId(this._currentUser.uid, band.id);
				band.members.push(this._currentUser);
				this._bandService.saveBand(band);
				subscription.unsubscribe();
			} else {
				this._popupDialogData = {
					title: 'No Band Found',
					content: `We could not find any band with the id: ${this.bandId}.`
				};
				this._matDialog.open(PopupDialogComponent, {
					data: this._popupDialogData
				});
			}
		});
	}
}
