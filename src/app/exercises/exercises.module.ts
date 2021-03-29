import { SaveExerciseProgressDialogComponent } from './exercise-details/save-exercise-progress-dialog/save-exercise-progress-dialog.component';
import { ExerciseModeSelectionComponent } from './exercise-mode-selection/exercise-mode-selection.component';
import { ExerciseDetailsComponent } from './exercise-details/exercise-details.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { AllMaterialModule } from './../material-module';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';
import { ExercisesRoutes } from './exercises.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from 'ngx-pinch-zoom';

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
