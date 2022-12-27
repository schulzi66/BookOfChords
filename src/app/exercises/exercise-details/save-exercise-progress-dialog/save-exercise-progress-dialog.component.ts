import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { filter } from 'rxjs/operators';
import { ExerciseModes } from 'src/app/models/exercise-mode.enum';
import { SaveExerciseProgressData } from './save-exercise-progress-data';

@Component({
    selector: 'app-save-exercise-progress-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TranslocoModule,
    ],
    templateUrl: './save-exercise-progress-dialog.component.html',
    styleUrls: ['./save-exercise-progress-dialog.component.scss'],
})
export class SaveExerciseProgressDialogComponent {
    public ExerciseModes = ExerciseModes;
    public initialStartBpm: number;

    constructor(
        public dialogRef: MatDialogRef<SaveExerciseProgressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SaveExerciseProgressData,
    ) {
        this.initialStartBpm = data.initialStartBpm;
        dialogRef
            .beforeClosed()
            .pipe(filter(saved => saved))
            .subscribe(() => {
                if (data.mode === ExerciseModes.INTERVAL) {
                    data.exercise.currentBpm = data.initialStartBpm;
                    data.exercise.nextBpm = data.initialNextBpm;
                }
            });
    }
}
