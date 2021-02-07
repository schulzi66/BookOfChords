import { ExerciseProgressHistoryStep } from './exercise-progress.enum';

export class Exercise {
  id: string;
  uid: string;
  name: string;
  description: string;
  currentBpm: number;
  nextBpm: number;
  pictureUrl: string;
  pdfUrl: string;
  sound: string;
  progress: ExerciseProgressHistoryStep[];

  constructor() {
      this.progress = [];
  }
}
