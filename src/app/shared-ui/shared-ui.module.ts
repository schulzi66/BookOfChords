import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from './../material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabBtnMatIcoComponent } from './components/fab-btn-mat-ico/fab-btn-mat-ico.component';
import { StringArrayLinesPipe } from './pipes/string-array-lines.pipe';
import { DropzoneDirective } from './directives/dropzone.directive';
import { UploaderComponent } from './components/uploader/uploader.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { SearchComponent } from './components/search/search.component';

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
