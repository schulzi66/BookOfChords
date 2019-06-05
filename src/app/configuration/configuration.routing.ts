import { RouterModule, Routes } from '@angular/router';
import { StylesComponent } from './styles/styles.component';

const routes: Routes = [
    {
        path: '',
        component: StylesComponent
    },
];

export const ConfigurationRoutes = RouterModule.forChild(routes);
