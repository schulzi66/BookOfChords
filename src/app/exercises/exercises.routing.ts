import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { Routes, RouterModule } from '@angular/router';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';
import { ExerciseResolver } from '../shared/resolvers/exercise.resolver';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesOverviewComponent,
    resolve: {
      drawerAction: DrawerActionResolver
    },
    data: {
      isBaseDrawerAction: true
    }
  },
  {
    path: 'edit/:id',
    component: ExerciseEditComponent,
    resolve: {
      drawerAction: DrawerActionResolver,
      exercise: ExerciseResolver
    }
  },
  {
      path: 'details/:id',
      component: ExerciseDetailsComponent,
      resolve: {
          drawerAction: DrawerActionResolver,
          exercise: ExerciseResolver
      }
  }
];

export const ExercisesRoutes = RouterModule.forChild(routes);
