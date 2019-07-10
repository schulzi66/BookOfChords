import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';

@NgModule({
	declarations: [ SongsOverviewComponent, SongDetailsviewComponent ],
	imports: [ CommonModule, FormsModule, SharedUiModule, AllMaterialModule, PdfViewerModule ],
	exports: [ SongsOverviewComponent, SongDetailsviewComponent ]
})
export class SongsModule {}
