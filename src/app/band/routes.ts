import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { BandEditComponent } from './band-edit/band-edit.component';
import { BandOverviewComponent } from './band-overview/band-overview.component';
import { BandSelectionComponent } from './band-selection/band-selection.component';
import { BandSetlistEditComponent } from './band-setlist-edit/band-setlist-edit.component';
import { NoBandOverviewComponent } from './no-band-overview/no-band-overview.component';

export default [
    {
        path: '',
        resolve: {
            key: TitleKeyResolver,
        },
        data: {
            key: TITLEKEYS.band,
        },
        children: [
            {
                path: '',
                component: BandOverviewComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
                data: {
                    isBaseDrawerAction: true,
                },
            },
            {
                path: 'selection',
                component: BandSelectionComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
                data: {
                    isBaseDrawerAction: true,
                },
            },
            {
                path: 'noband',
                component: NoBandOverviewComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
                data: {
                    isBaseDrawerAction: true,
                },
            },
            {
                path: 'edit/:id',
                component: BandEditComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
            },
            {
                path: 'setlist/edit/:id',
                component: BandSetlistEditComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
            },
        ],
    },
] as Route[];
