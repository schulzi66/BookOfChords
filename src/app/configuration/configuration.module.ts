import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllMaterialModule } from '../material-module';
import { StylesComponent } from './styles/styles.component';
import { FormsModule } from '@angular/forms';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ConfigurationRoutes } from './configuration.routing';

@NgModule({
  declarations: [
    StylesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedUiModule,
    AllMaterialModule,
    ConfigurationRoutes
  ],
  exports: [
    StylesComponent
  ]
})
export class ConfigurationModule { }
