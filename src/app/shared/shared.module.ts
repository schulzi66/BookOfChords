import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AllMaterialModule } from '../material-module';
import { BottomSheetBandSelectionComponent } from './components/bottom-sheet-band-selection/bottom-sheet-band-selection.component';
import { BottomSheetUploaderComponent } from './components/bottom-sheet-uploader/bottom-sheet-uploader.component';
import { DeletePopupDialogComponent } from './components/delete-popup-dialog/delete-popup-dialog.component';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { PinchZoomComponent } from './components/pinch-zoom/pinch-zoom.component';
import { RockNRollSnackbarComponent } from './components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { MaxDirective } from './directives/max.directive';
import { MinDirective } from './directives/min.directive';
import { EncodeUriPipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    FabBtnMatIcoComponent,
    EncodeUriPipe,
    DropzoneDirective,
    MinDirective,
    MaxDirective,
    UploaderComponent,
    UploadTaskComponent,
    DeletePopupDialogComponent,
    RockNRollSnackbarComponent,
    BottomSheetBandSelectionComponent,
    BottomSheetUploaderComponent,
    PinchZoomComponent
  ],
  imports: [CommonModule, AllMaterialModule, FormsModule, ReactiveFormsModule, TranslocoModule, RouterModule],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, panelClass: 'message-snackbar' }
    }
  ],
  exports: [
    FabBtnMatIcoComponent,
    EncodeUriPipe,
    UploaderComponent,
    DeletePopupDialogComponent,
    BottomSheetBandSelectionComponent,
    BottomSheetUploaderComponent,
    PinchZoomComponent
  ]
})
export class SharedModule {}
