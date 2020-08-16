import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';
import { Routes, RouterModule } from '@angular/router';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';

const routes: Routes = [
  {
    path: '',
    component: SongsOverviewComponent
  },
  {
    path: 'edit/:id',
    component: SongDetailsviewComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    }
  }
];

export const SongRoutes = RouterModule.forChild(routes);
