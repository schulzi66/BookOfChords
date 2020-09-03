import { SongResolver } from './../shared/resolvers/song.resolver';
import { UserResolver } from './../shared/resolvers/user.resolver';
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
    resolve: { key: TitleKeyResolver, user: UserResolver },
    data: { key: TITLEKEYS.songs },
    children: [
      {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full'
      },
      {
        path: 'songs',
        component: SongsOverviewComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'songs/edit/:id',
        component: SongDetailsviewComponent,
        resolve: {
          drawerAction: DrawerActionResolver,
          song: SongResolver
        }
      }
    ]
  }
];

export const SongRoutes = RouterModule.forChild(routes);
