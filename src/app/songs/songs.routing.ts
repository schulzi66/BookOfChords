import { AuthGuard } from './../shared/guards/auth.guard';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';
import { Routes, RouterModule } from '@angular/router';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { TITLEKEYS } from '../services/title-key.service';

const routes: Routes = [
  {
    path: '',
    component: SongsOverviewComponent,
    canActivate: [AuthGuard],
    resolve: { key: TitleKeyResolver },
    data: { key: TITLEKEYS.songs }
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
