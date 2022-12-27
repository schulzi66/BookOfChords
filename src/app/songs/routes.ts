import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { SongResolver } from '../shared/resolvers/song.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { UserResolver } from '../shared/resolvers/user.resolver';
import { SongDetailsviewComponent } from './song-detailsview/song-detailsview.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongsOverviewComponent } from './songs-overview/songs-overview.component';

export default [
    {
        path: '',
        resolve: {
            key: TitleKeyResolver,
            user: UserResolver,
        },
        data: {
            key: TITLEKEYS.songs,
        },
        children: [
            {
                path: '',
                component: SongsOverviewComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
                data: {
                    isBaseDrawerAction: true,
                },
            },
            {
                path: 'details/:id',
                component: SongDetailsviewComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                    song: SongResolver,
                },
            },
            {
                path: 'edit/:id',
                component: SongEditComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                    song: SongResolver,
                },
            },
        ],
    },
] as Route[];
