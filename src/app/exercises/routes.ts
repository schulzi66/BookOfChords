import { Route } from '@angular/router';
import { TITLEKEYS } from '../services/title-key.service';
import { DrawerActionResolver } from '../shared/resolvers/drawer-action.resolver';
import { ExerciseResolver } from '../shared/resolvers/exercise.resolver';
import { TitleKeyResolver } from '../shared/resolvers/title-key.resolver';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';
import { ExerciseModeSelectionComponent } from './exercise-mode-selection/exercise-mode-selection.component';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';

export default [
    {
        path: '',
        resolve: {
            key: TitleKeyResolver,
        },
        data: {
            key: TITLEKEYS.exercises,
        },
        children: [
            {
                path: '',
                component: ExercisesOverviewComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                },
                data: {
                    isBaseDrawerAction: true,
                },
            },
            {
                path: 'edit/:id',
                component: ExerciseEditComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                    exercise: ExerciseResolver,
                },
            },
            {
                path: 'mode/:id',
                component: ExerciseModeSelectionComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                    exercise: ExerciseResolver,
                },
            },
            {
                path: 'details/:id/:mode',
                component: ExerciseDetailsComponent,
                resolve: {
                    drawerAction: DrawerActionResolver,
                    exercise: ExerciseResolver,
                },
            },
        ],
    },
] as Route[];
