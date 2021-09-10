import { RouterModule, Routes } from '@angular/router';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { ExerciseResolver } from '../shared/resolvers/exercise.resolver';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';
import { ExerciseModeSelectionComponent } from './exercise-mode-selection/exercise-mode-selection.component';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';

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
    path: 'mode/:id',
    component: ExerciseModeSelectionComponent,
    resolve: {
      drawerAction: DrawerActionResolver,
      exercise: ExerciseResolver
    }
  },
  {
    path: 'details/:id/:mode',
    component: ExerciseDetailsComponent,
    resolve: {
      drawerAction: DrawerActionResolver,
      exercise: ExerciseResolver
    }
  }
];

export const ExercisesRoutes = RouterModule.forChild(routes);
