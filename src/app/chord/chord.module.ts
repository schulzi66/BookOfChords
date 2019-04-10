import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ChordEditComponent } from './chord-edit/chord-edit.component';
import { ChordOverviewComponent } from './chord-overview/chord-overview.component';

@NgModule({
  declarations: [
    ChordOverviewComponent,
    ChordEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedUiModule,
    AllMaterialModule
  ],
  exports: [
    ChordOverviewComponent,
    ChordEditComponent
  ]
})
export class ChordModule { }
