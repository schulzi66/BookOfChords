import { GigResolver } from './../shared/resolvers/gig.resolver';
import { RouterModule, Routes } from '@angular/router';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';

const routes: Routes = [
  {
    path: '',
    component: GigOverviewComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    },
    data: {
      isBaseDrawerAction: true
    }
  },
  {
    path: 'edit/:id',
    component: GigEditComponent,
    resolve: {
      drawerAction: DrawerActionResolver,
      gig: GigResolver
    }
  },
  {
    path: 'details/:id',
    component: GigDetailComponent,
    resolve: {
      drawerAction: DrawerActionResolver,
      gig: GigResolver
    }
  }
];

export const GigRoutes = RouterModule.forChild(routes);
