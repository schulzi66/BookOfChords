import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { BandCreateComponent } from './band-create/band-create.component';
import { BandJoinComponent } from './band-join/band-join.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandRoutes } from './band.routing';
import { KonzertmeisterIntegrationModule } from './konzertmeister/konzertmeister-integration.module';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

@NgModule({
	imports: [
		CommonModule,
		KonzertmeisterIntegrationModule,
		BandRoutes,
		SharedUiModule,
		AllMaterialModule,
		FormsModule
	],
	declarations: [ BandOverviewComponent, NoBandOverviewComponent, BandCreateComponent, BandJoinComponent ],
	exports: [ BandOverviewComponent, NoBandOverviewComponent, BandCreateComponent, BandJoinComponent ]
})
export class BandModule {}
