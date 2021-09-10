import { RouterModule, Routes } from '@angular/router';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSelectionComponent } from './band-selection/band-selection.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

const routes: Routes = [
  {
    path: '',
    component: BandOverviewComponent
  },
  {
    path: 'selection',
    component: BandSelectionComponent
  },
  {
    path: 'noband',
    component: NoBandOverviewComponent
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
      drawerAction: DrawerActionResolver
    }
  }
];

export const BandRoutes = RouterModule.forChild(routes);
