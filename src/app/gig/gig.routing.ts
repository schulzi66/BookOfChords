import { RouterModule, Routes } from '@angular/router';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';

const routes: Routes = [
    {
        path: '',
        component: GigOverviewComponent
    },
    {
        path: 'edit',
        component: GigEditComponent
    },
    {
        path: ':details',
        component: GigDetailComponent
    }
];

export const GigRoutes = RouterModule.forChild(routes);
