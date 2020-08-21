import { RouterModule, Routes } from '@angular/router';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';

const routes: Routes = [
  {
    path: '',
    component: GigOverviewComponent
  },
  {
    path: 'edit/:id',
    component: GigEditComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    }
  },
  {
    path: 'details/:id',
    component: GigDetailComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    }
  }
];

export const GigRoutes = RouterModule.forChild(routes);
