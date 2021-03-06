import { DrawerActionResolver } from './../shared/resolvers/drawer-action.resolver';
import { SongResolver } from './../shared/resolvers/song.resolver';
import { UserResolver } from './../shared/resolvers/user.resolver';
import { AuthGuard } from './../shared/guards/auth.guard';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';
import { Routes, RouterModule } from '@angular/router';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { TITLEKEYS } from '../services/title-key.service';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      key: TitleKeyResolver,
      user: UserResolver
    },
    data: {
      key: TITLEKEYS.songs
    },
    children: [
      {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full'
      },
      {
        path: 'songs',
        component: SongsOverviewComponent,
        canActivate: [AuthGuard],
        resolve: {
          drawerAction: DrawerActionResolver
        },
        data: {
          isBaseDrawerAction: true
        }
      },
      {
        path: 'songs/details/:id',
        component: SongDetailsviewComponent,
        canActivate: [AuthGuard],
        resolve: {
          drawerAction: DrawerActionResolver,
          song: SongResolver
        }
      },
      {
        path: 'songs/edit/:id',
        component: SongEditComponent,
        resolve: {
          drawerAction: DrawerActionResolver,
          song: SongResolver
        }
      }
    ]
  }
];

export const SongRoutes = RouterModule.forChild(routes);
