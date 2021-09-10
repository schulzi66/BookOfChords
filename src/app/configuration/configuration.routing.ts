import { RouterModule, Routes } from '@angular/router';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { ConfigurationComponent } from './configuration/configuration.component';

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
