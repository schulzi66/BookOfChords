import { Exercise } from 'src/app/models/exercise';
import { ExerciseModes } from 'src/app/models/exercise-mode.enum';

export interface SaveExerciseProgressData {
    mode: ExerciseModes;
    exercise: Exercise;
    initialStartBpm: number;
    initialNextBpm: number;
}
