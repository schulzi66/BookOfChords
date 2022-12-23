import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { DeletePopupDialogData } from './delete-popup-dialog-data';
@Component({
  selector: 'shared-popup-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, TranslocoModule],
  templateUrl: './delete-popup-dialog.component.html',
  styleUrls: ['./delete-popup-dialog.component.scss']
})
export class DeletePopupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeletePopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeletePopupDialogData
  ) {}
}
