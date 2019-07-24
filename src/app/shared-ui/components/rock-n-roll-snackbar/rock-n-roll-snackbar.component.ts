import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
	selector: 'app-rock-n-roll-snackbar',
	templateUrl: './rock-n-roll-snackbar.component.html',
	styleUrls: [ './rock-n-roll-snackbar.component.scss' ]
})
export class RockNRollSnackbarComponent implements OnInit {
	public message: string;

	constructor(@Inject(MAT_SNACK_BAR_DATA) data: string) {
		this.message = data;
	}

	ngOnInit() {}
}
