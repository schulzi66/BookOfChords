import { AllMaterialModule } from './../material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { StringArrayLinesPipe } from './pipes/string-array-lines.pipe';
import { DropzoneDirective } from './directives/dropzone.directive';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';

@NgModule({
  declarations: [
    FabBtnMatIcoComponent,
    StringArrayLinesPipe,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent
  ],
  imports: [
    CommonModule,
    AllMaterialModule
  ],
  exports: [
    FabBtnMatIcoComponent,
    StringArrayLinesPipe,
    UploaderComponent
  ]
})
export class SharedUiModule { }
