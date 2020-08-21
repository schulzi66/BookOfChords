import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent,
        resolve: {
            drawerAction: DrawerActionResolver
          }
    },
];

export const ConfigurationRoutes = RouterModule.forChild(routes);
