import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { PinchZoomModule } from 'ngx-pinch-zoom';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';

@NgModule({
	declarations: [ SongsOverviewComponent, SongDetailsviewComponent ],
	imports: [
		CommonModule,
		FormsModule,
		SharedUiModule,
		AllMaterialModule,
		NgxExtendedPdfViewerModule,
		// PinchZoomModule,
        TranslocoModule,
        ClipboardModule
	],
	exports: [ SongsOverviewComponent, SongDetailsviewComponent ]
})
export class SongsModule {}
