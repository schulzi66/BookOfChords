import { Routes, RouterModule } from '@angular/router';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigDetailComponent } from './gig-detail/gig-detail.component';

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
