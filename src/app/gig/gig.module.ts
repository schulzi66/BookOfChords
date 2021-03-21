import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';
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
    NgxExtendedPdfViewerModule,
    PinchZoomModule,
    TranslocoModule
  ],
  exports: [GigOverviewComponent, GigEditComponent, GigDetailComponent]
})
export class GigModule {}
