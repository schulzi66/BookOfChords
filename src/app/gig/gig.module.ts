import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { AllMaterialModule } from '../material-module';
import { FormsModule } from '@angular/forms';
import { GigRoutes } from './gig.routing';

@NgModule({
  declarations: [
    GigOverviewComponent,
    GigEditComponent,
    GigDetailComponent
  ],
  imports: [
    CommonModule,
    SharedUiModule,
    AllMaterialModule,
    FormsModule,
    GigRoutes
  ],
  exports: [  
    GigOverviewComponent,
    GigEditComponent,
    GigDetailComponent
  ]
})
export class GigModule { }
