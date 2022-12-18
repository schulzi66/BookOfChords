import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MetronomeComponent } from 'src/app/shared/components/metronome/metronome.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { AllMaterialModule } from './../material-module';
import { PinchZoomComponent } from './../shared/components/pinch-zoom/pinch-zoom.component';
import { EncodeUriPipe } from './../shared/pipes/encode.pipe';
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
    PinchZoomComponent,
    EncodeUriPipe,
    MetronomeComponent,
    SharedModule,
    FormsModule,
    TranslocoModule,
    SearchComponent,
    ExercisesRoutes,
    PdfJsViewerModule,
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
