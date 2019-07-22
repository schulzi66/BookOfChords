import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { BandCreateComponent } from './band-create/band-create.component';
import { BandDetailComponent } from './band-detail/band-detail.component';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandJoinComponent } from './band-join/band-join.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandRoutes } from './band.routing';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration/konzertmeister-integration.component';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

@NgModule({
	imports: [ CommonModule, BandRoutes, SharedUiModule, AllMaterialModule, FormsModule ],
	declarations: [
		BandOverviewComponent,
		NoBandOverviewComponent,
		BandCreateComponent,
		BandJoinComponent,
		KonzertmeisterIntegrationComponent,
		BandDetailComponent,
		BandEditComponent
	],
	exports: [
		BandOverviewComponent,
		NoBandOverviewComponent,
		BandCreateComponent,
		BandJoinComponent,
		KonzertmeisterIntegrationComponent,
		BandDetailComponent,
		BandEditComponent
	]
})
export class BandModule {}
