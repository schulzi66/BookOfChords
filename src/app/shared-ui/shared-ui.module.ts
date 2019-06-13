import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from './../material-module';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { MetronomeComponent } from './components/metronome/metronome.component';
import { PopupDialogComponent } from './components/popup-dialog/popup-dialog.component';
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
        MetronomeComponent
    ],
    imports: [
        CommonModule,
        AllMaterialModule,
        FormsModule
    ],
    // providers: [
    //   {
    //     provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
    //       restoreFocus: false
    //     }
    //   }
    // ],
    entryComponents: [PopupDialogComponent],
    exports: [
        FabBtnMatIcoComponent,
        StringArrayLinesPipe,
        UploaderComponent,
        SearchComponent,
        PopupDialogComponent,
        MetronomeComponent
    ]
})
export class SharedUiModule { }
