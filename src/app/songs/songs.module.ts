import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { AllMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';
import { SongRoutes } from './songs.routing';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';

@NgModule({
  declarations: [SongsOverviewComponent, SongEditComponent, SongDetailsviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SongRoutes,
    AllMaterialModule,
    NgxExtendedPdfViewerModule,
    PinchZoomModule,
    TranslocoModule,
    ScrollingModule,
    ClipboardModule
  ],
  exports: [SongsOverviewComponent, SongEditComponent, SongDetailsviewComponent]
})
export class SongsModule {}
