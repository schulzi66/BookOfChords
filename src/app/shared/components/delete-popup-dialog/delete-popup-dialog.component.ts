import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeletePopupDialogData } from './delete-popup-dialog-data';
@Component({
  selector: 'shared-popup-dialog',
  templateUrl: './delete-popup-dialog.component.html',
  styleUrls: ['./delete-popup-dialog.component.scss']
})
export class DeletePopupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeletePopupDialogData
  ) {}
}
