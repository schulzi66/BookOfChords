import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { PinchZoomModule } from 'ngx-pinch-zoom';
import { AllMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';
import { SongRoutes } from './songs.routing';

@NgModule({
  declarations: [SongsOverviewComponent, SongDetailsviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SongRoutes,
    AllMaterialModule,
    NgxExtendedPdfViewerModule,
    // PinchZoomModule,
    TranslocoModule,
    ClipboardModule
  ],
  exports: [SongsOverviewComponent, SongDetailsviewComponent]
})
export class SongsModule {}
