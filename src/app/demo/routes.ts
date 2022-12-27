import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { DemoComponent } from './demo.component';

export default [
    {
        path: '',
        component: DemoComponent,
        resolve: {
            key: TitleKeyResolver,
            drawerAction: DrawerActionResolver,
        },
        data: {
            key: TITLEKEYS.demo,
            isBaseDrawerAction: true,
        },
    },
] as Route[];
