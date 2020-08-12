import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AllMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { BandCreateComponent } from './band-create/band-create.component';
import { BandDetailComponent } from './band-detail/band-detail.component';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandJoinComponent } from './band-join/band-join.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';
import { BandSetlistOverviewComponent } from './band-setlist-overview/band-setlist-overview.component';
import { BandRoutes } from './band.routing';
import { KonzertmeisterIntegrationComponent } from './konzertmeister-integration/konzertmeister-integration.component';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

@NgModule({
	imports: [
		CommonModule,
		BandRoutes,
		SharedModule,
		AllMaterialModule,
		FormsModule,
		NgxExtendedPdfViewerModule,
		TranslocoModule
	],
	declarations: [
		BandOverviewComponent,
		NoBandOverviewComponent,
		BandCreateComponent,
		BandJoinComponent,
		KonzertmeisterIntegrationComponent,
		BandDetailComponent,
		BandEditComponent,
		BandSetlistOverviewComponent,
		BandSetlistEditComponent
	],
	exports: [
		BandOverviewComponent,
		NoBandOverviewComponent,
		BandCreateComponent,
		BandJoinComponent,
		KonzertmeisterIntegrationComponent,
		BandDetailComponent,
		BandEditComponent,
		BandSetlistOverviewComponent,
		BandSetlistEditComponent
	]
})
export class BandModule {}
