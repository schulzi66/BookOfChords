import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ExerciseModes } from 'src/app/models/exercise-mode.enum';
import { SaveExerciseProgressData } from './save-exercise-progress-data';

@Component({
  selector: 'app-save-exercise-progress-dialog',
  templateUrl: './save-exercise-progress-dialog.component.html',
  styleUrls: ['./save-exercise-progress-dialog.component.scss']
})
export class SaveExerciseProgressDialogComponent {
  public ExerciseModes = ExerciseModes;
  public initialStartBpm: number;

  constructor(
    public dialogRef: MatDialogRef<SaveExerciseProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SaveExerciseProgressData
  ) {
    this.initialStartBpm = data.initialStartBpm;
    dialogRef
      .beforeClosed()
      .pipe(filter((saved) => saved))
      .subscribe(() => {
        if (data.mode === ExerciseModes.INTERVAL) {
          data.exercise.currentBpm = data.initialStartBpm;
          data.exercise.nextBpm = data.initialNextBpm;
        }
      });
  }
}
