import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AllMaterialModule } from '../material-module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
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
