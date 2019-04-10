import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from './../material-module';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
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
    SearchComponent
  ],
  imports: [
    CommonModule,
    AllMaterialModule,
    FormsModule
  ],
  exports: [
    FabBtnMatIcoComponent,
    StringArrayLinesPipe,
    UploaderComponent,
    SearchComponent
  ]
})
export class SharedUiModule { }
