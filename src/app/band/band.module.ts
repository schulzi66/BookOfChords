import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { AllMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { EncodeUriPipe } from './../shared/pipes/encode.pipe';
import { BandCreateComponent } from './band-create/band-create.component';
import { BandDetailComponent } from './band-detail/band-detail.component';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandJoinComponent } from './band-join/band-join.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSelectionComponent } from './band-selection/band-selection.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';
import { BandSetlistOverviewComponent } from './band-setlist-overview/band-setlist-overview.component';
import { BandRoutes } from './band.routing';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

@NgModule({
  imports: [
    CommonModule,
    SearchComponent,
    BandRoutes,
    SharedModule,
    AllMaterialModule,
    EncodeUriPipe,
    FormsModule,
    PdfJsViewerModule,
    TranslocoModule
  ],
  declarations: [
    BandOverviewComponent,
    BandSelectionComponent,
    NoBandOverviewComponent,
    BandCreateComponent,
    BandJoinComponent,
    BandDetailComponent,
    BandEditComponent,
    BandSetlistOverviewComponent,
    BandSetlistEditComponent
  ],
  exports: [
    BandOverviewComponent,
    BandSelectionComponent,
    NoBandOverviewComponent,
    BandCreateComponent,
    BandJoinComponent,
    BandDetailComponent,
    BandEditComponent,
    BandSetlistOverviewComponent,
    BandSetlistEditComponent
  ]
})
export class BandModule {}
