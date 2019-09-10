import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { ConfigurationRoutes } from './configuration.routing';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
	declarations: [ ConfigurationComponent ],
	imports: [ CommonModule, FormsModule, SharedUiModule, AllMaterialModule, ConfigurationRoutes, TranslocoModule ],
	exports: [ ConfigurationComponent ]
})
export class ConfigurationModule {}
