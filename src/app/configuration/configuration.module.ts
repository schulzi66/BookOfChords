import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ConfigurationRoutes } from './configuration.routing';
import { StylesComponent } from './styles/styles.component';

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
