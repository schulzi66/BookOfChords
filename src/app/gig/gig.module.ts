import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { AllMaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
import { GigRoutes } from './gig.routing';

@NgModule({
  declarations: [GigOverviewComponent, GigEditComponent, GigDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    AllMaterialModule,
    FormsModule,
    GigRoutes,
    PdfJsViewerModule,
    TranslocoModule
  ],
  exports: [GigOverviewComponent, GigEditComponent, GigDetailComponent]
})
export class GigModule {}
