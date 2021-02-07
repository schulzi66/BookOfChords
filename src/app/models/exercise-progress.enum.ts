import { ExerciseModes } from './exercise-mode.enum';

export class ExerciseProgressHistoryStep {
  date: Date;
  initialBpm: number;
  usedBpm: number;
  nextBpm: number;
  mode: ExerciseModes;
}
