import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AllMaterialModule } from '../material-module';
import { BottomSheetUploaderComponent } from './components/bottom-sheet-uploader/bottom-sheet-uploader.component';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { MetronomeComponent } from './components/metronome/metronome.component';
import { DeletePopupDialogComponent } from './components/delete-popup-dialog/delete-popup-dialog.component';
import { RockNRollSnackbarComponent } from './components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { SearchComponent } from './components/search/search.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { StringArrayLinesPipe } from './pipes/string-array-lines.pipe';

@NgModule({
  declarations: [
    FabBtnMatIcoComponent,
    StringArrayLinesPipe,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent,
    SearchComponent,
    DeletePopupDialogComponent,
    MetronomeComponent,
    RockNRollSnackbarComponent,
    BottomSheetUploaderComponent
  ],
  imports: [CommonModule, AllMaterialModule, FormsModule, TranslocoModule, RouterModule],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000, panelClass: 'message-snackbar' }
    }
  ],
  exports: [
    FabBtnMatIcoComponent,
    StringArrayLinesPipe,
    UploaderComponent,
    SearchComponent,
    DeletePopupDialogComponent,
    MetronomeComponent,
    BottomSheetUploaderComponent
  ]
})
export class SharedModule {}
