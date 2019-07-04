import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigurationComponent
    },
];

export const ConfigurationRoutes = RouterModule.forChild(routes);
