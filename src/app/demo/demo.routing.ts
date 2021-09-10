import { RouterModule, Routes } from '@angular/router';
import { DrawerActionResolver } from './../shared/resolvers/drawer-action.resolver';
import { DemoComponent } from './demo.component';

export const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    },
    data: {
      isBaseDrawerAction: true
    }
  }
];

export const DemoRoutes = RouterModule.forChild(routes);
