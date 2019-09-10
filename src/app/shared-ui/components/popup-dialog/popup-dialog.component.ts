import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PopupDialogData } from './popup-dialog-data';
@Component({
	selector: 'shared-popup-dialog',
	templateUrl: './popup-dialog.component.html',
	styleUrls: [ './popup-dialog.component.scss' ]
})
export class PopupDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<PopupDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: PopupDialogData
	) {}
}
