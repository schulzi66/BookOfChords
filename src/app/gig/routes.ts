import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { GigResolver } from '../shared/resolvers/gig.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { GigDetailComponent } from './gig-detail/gig-detail.component';
import { GigEditComponent } from './gig-edit/gig-edit.component';
import { GigOverviewComponent } from './gig-overview/gig-overview.component';

export default [
  {
    path: '',
    resolve: {
      key: TitleKeyResolver
    },
    data: {
      key: TITLEKEYS.gigs
    },
    children: [
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
    ]
  }
] as Route[];
