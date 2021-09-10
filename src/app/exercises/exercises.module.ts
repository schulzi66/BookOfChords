import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { AllMaterialModule } from './../material-module';
import { SharedModule } from './../shared/shared.module';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { SaveExerciseProgressDialogComponent } from './exercise-details/save-exercise-progress-dialog/save-exercise-progress-dialog.component';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';
import { ExerciseModeSelectionComponent } from './exercise-mode-selection/exercise-mode-selection.component';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';
import { ExercisesRoutes } from './exercises.routing';

@NgModule({
  imports: [
    CommonModule,
    AllMaterialModule,
    SharedModule,
    FormsModule,
    TranslocoModule,
    ExercisesRoutes,
    NgxExtendedPdfViewerModule,
    PinchZoomModule
  ],
  declarations: [
    ExercisesOverviewComponent,
    ExerciseEditComponent,
    ExerciseDetailsComponent,
    ExerciseModeSelectionComponent,
    SaveExerciseProgressDialogComponent
  ]
})
export class ExercisesModule {}
