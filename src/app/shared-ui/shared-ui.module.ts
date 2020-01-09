import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { AllMaterialModule } from './../material-module';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { MetronomeComponent } from './components/metronome/metronome.component';
import { PopupDialogComponent } from './components/popup-dialog/popup-dialog.component';
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
		PopupDialogComponent,
		MetronomeComponent,
		RockNRollSnackbarComponent
	],
	imports: [ CommonModule, AllMaterialModule, FormsModule, TranslocoModule, RouterModule ],
	providers: [
		{
			provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: { duration: 5000, panelClass: 'message-snackbar' }
		}
	],
	entryComponents: [ PopupDialogComponent, RockNRollSnackbarComponent ],
	exports: [
		FabBtnMatIcoComponent,
		StringArrayLinesPipe,
		UploaderComponent,
		SearchComponent,
		PopupDialogComponent,
		MetronomeComponent,
		RockNRollSnackbarComponent
	]
})
export class SharedUiModule {}
