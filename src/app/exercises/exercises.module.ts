import { ExercisesRoutes } from './exercises.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExercisesOverviewComponent } from './exercises-overview/exercises-overview.component';

@NgModule({
  imports: [CommonModule, ExercisesRoutes],
  declarations: [ExercisesOverviewComponent],
  exports: [ExercisesOverviewComponent]
})
export class ExercisesModule {}
