import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { Routes, RouterModule } from '@angular/router';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';

const routes: Routes = [
  { 
      path: '',
      component: ExercisesOverviewComponent,
      resolve: {
          drawerAction: DrawerActionResolver
      },
      data : {
          isBaseDrawerAction: true
      }
   },
];

export const ExercisesRoutes = RouterModule.forChild(routes);
