import { MetronomeComponent } from './../../shared/components/metronome/metronome.component';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { ExerciseModes } from './../../models/exercise-mode.enum';
import { Exercise } from 'src/app/models/exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseDetailsComponent implements OnInit {
  private readonly _minuteInMs: number = 60000;
  private _timerHandle: number;

  public exercise: Exercise;
  public currentMode: ExerciseModes;
  public ExerciseModes = ExerciseModes;

  public exerciseDuration: number;

  public exerciseDurationPercentage: number;

  public intervalDurationPercentage: number;
  public intervalTime: number;
  public intervalBpm: number;

  @ViewChild('metronom') metronom: MetronomeComponent;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _navbarActionService: NavbarActionService,
    private readonly _router: Router,
    public readonly configurationService: ConfigurationService
  ) {
    this.exerciseDuration = 5;
    this.intervalTime = 1;
    this.intervalBpm = 5;
    this.intervalDurationPercentage = 0;

    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'edit',
        action: () => this._router.navigate(['/exercises/edit', this.exercise.id])
      }
    ]);
  }

  ngOnInit() {
    this.exercise = this._activatedRoute.snapshot.data['exercise'];
    this.currentMode = this._activatedRoute.snapshot.params['mode'] as ExerciseModes;
  }

  public startIntervalMode(): void {
    if (this.exerciseDuration && this.intervalTime && this.intervalBpm) {
      const start = new Date();
      let current = new Date();
      let next = new Date(start.getTime() + this.intervalTime * this._minuteInMs);
      const end = new Date(start.getTime() + this.exerciseDuration * this._minuteInMs);
      this._timerHandle = window.setInterval(() => {
        this.handleTotalExerciseProgress(start, end);
        if (current >= next) {
          this.exercise.currentBpm += this.intervalBpm;
          this.intervalDurationPercentage = 0;
          next = new Date(current.getTime() + this.intervalTime * this._minuteInMs);
        } else {
          this.intervalDurationPercentage = Math.round(
            ((new Date().getTime() - current.getTime()) / (next.getTime() - current.getTime())) * 100
          );
          if (this.intervalDurationPercentage >= 100) {
            current = new Date();
          }
        }
      }, 1000);
    }
  }

  public startTimebasedMode(): void {
    if (this.exerciseDuration) {
      const start = new Date();
      const end = new Date(start.getTime() + this.exerciseDuration * this._minuteInMs);
      this._timerHandle = window.setInterval(() => {
        this.handleTotalExerciseProgress(start, end);
      }, 1000);
    }
  }

  public stopExercise(): void {
    window.clearInterval(this._timerHandle);
  }

  private handleTotalExerciseProgress(start: Date, end: Date): void {
    this.exerciseDurationPercentage = Math.round(
      ((new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
    );
    if (this.exerciseDurationPercentage >= 100) {
      this.metronom.togglePlayMode();
      this.stopExercise();
    }
  }
}
