import { BandResolver } from './../shared/resolvers/band.resolver';
import { RouterModule, Routes } from '@angular/router';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';

const routes: Routes = [
  {
    path: '',
    component: BandOverviewComponent
  },
  {
    path: 'edit/:id',
    component: BandEditComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    }
  },
  {
    path: 'setlist/edit/:id',
    component: BandSetlistEditComponent,
    resolve: {
      drawerAction: DrawerActionResolver,

    }
  }
];

export const BandRoutes = RouterModule.forChild(routes);
