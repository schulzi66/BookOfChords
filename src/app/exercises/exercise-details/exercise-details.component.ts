import { SaveExerciseProgressDialogComponent } from './save-exercise-progress-dialog/save-exercise-progress-dialog.component';
import { DrawerActionService } from './../../services/drawer-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { DeletePopupDialogComponent } from './../../shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { INavbarAction } from './../../models/navbar-action';
import { ExercisesService } from './../services/exercises.service';
import { filter } from 'rxjs/operators';
import { translate } from '@ngneat/transloco';
import { MetronomeComponent } from './../../shared/components/metronome/metronome.component';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { ExerciseModes } from './../../models/exercise-mode.enum';
import { Exercise } from 'src/app/models/exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DeletePopupDialogData } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog-data';
import { SaveExerciseProgressData } from './save-exercise-progress-dialog/save-exercise-progress-data';

@Component({
  selector: 'app-exercise-details',
  templateUrl: './exercise-details.component.html',
  styleUrls: ['./exercise-details.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseDetailsComponent extends SubscriptionHandler implements OnInit, AfterViewInit, OnDestroy {
  private readonly _minuteInMs: number = 60000;
  private _timerHandle: number;
  private _isDirty: boolean;

  public exercise: Exercise;
  public currentMode: ExerciseModes;
  public ExerciseModes = ExerciseModes;
  public isPracticing: boolean;
  public exerciseDurationPercentage: number;
  public exerciseDurationTimeElapsed: string;
  public intervalDurationPercentage: number;

  public initialStartBpm: number;
  public initialNextBpm: number;

  @ViewChild(MetronomeComponent) private _metronomeRef: MetronomeComponent;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _navbarActionService: NavbarActionService,
    private readonly _router: Router,
    private readonly _matDialog: MatDialog,
    private readonly _exercisesService: ExercisesService,
    private readonly _snackbarService: SnackbarService,
    private readonly _drawerActionService: DrawerActionService,
    public readonly configurationService: ConfigurationService
  ) {
    super();
    this.intervalDurationPercentage = 100;
    this.exerciseDurationTimeElapsed = '00:00';
    this._isDirty = false;
    this.isPracticing = false;

    this.registerNavbarActions(false);
    this._drawerActionService.preDrawerAction = () => {
      if (this._isDirty) {
        this.exercise.currentBpm = this.initialStartBpm;
        this.exercise.nextBpm = this.initialNextBpm;
      }
    };
  }

  public ngOnInit(): void {
    this.exercise = this._activatedRoute.snapshot.data['exercise'];
    this.currentMode = Number.parseInt(this._activatedRoute.snapshot.params['mode']) as ExerciseModes;
    this.initialStartBpm = this.exercise.currentBpm;
    this.initialNextBpm = this.exercise.nextBpm;
  }

  public ngAfterViewInit(): void {
    this._metronomeRef.onBpmChanged.subscribe((_) => (this._isDirty = true));
  }

  public ngOnDestroy(): void {
    this.stopExercise();
  }

  public startExercise(): void {
    this.isPracticing = true;
    switch (this.currentMode) {
      case ExerciseModes.INTERVAL:
        if (
          this.exercise.duration &&
          this.exercise.intervalCount &&
          this.exercise.currentBpm &&
          this.exercise.nextBpm
        ) {
          this.registerNavbarActions(true);
          this.startIntervalMode();
        }
        break;

      case ExerciseModes.TIMEBASED:
        if (this.exercise.duration) {
          this.registerNavbarActions(true);
          this.startTimebasedMode();
        }
        break;

      default:
        this.registerNavbarActions(true);
        break;
    }
  }

  public stopExercise(): void {
    this.isPracticing = false;
    window.clearInterval(this._timerHandle);
  }

  private startIntervalMode(): void {
    const start = new Date();
    let current = new Date();
    const intervalDuration = (this.exercise.duration * this._minuteInMs) / this.exercise.intervalCount;
    let next = new Date(start.getTime() + intervalDuration);
    const end = new Date(start.getTime() + this.exercise.duration * this._minuteInMs);
    const increasePerInterval = Math.round(
      (this.exercise.nextBpm - this.exercise.currentBpm) / (this.exercise.intervalCount - 1)
    );
    this._timerHandle = window.setInterval(() => {
      this.handleTotalExerciseProgress(start, end);
      if (current >= next) {
        this._metronomeRef.changeSpeed(this.exercise.currentBpm + increasePerInterval);
        this.intervalDurationPercentage = 100;
        next = new Date(current.getTime() + intervalDuration);
      } else {
        this.intervalDurationPercentage =
          100 - Math.round(((new Date().getTime() - current.getTime()) / (next.getTime() - current.getTime())) * 100);

        if (this.intervalDurationPercentage <= 0) {
          current = new Date();
        }
      }
    }, 1000);
  }

  private startTimebasedMode(): void {
    const start = new Date();
    const end = new Date(start.getTime() + this.exercise.duration * this._minuteInMs);
    this._timerHandle = window.setInterval(() => {
      this.handleTotalExerciseProgress(start, end);
    }, 1000);
  }

  private handleTotalExerciseProgress(start: Date, end: Date): void {
    this.calculateElapsedTime(start);

    this.exerciseDurationPercentage = Math.round(
      ((new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
    );
    if (this.exerciseDurationPercentage >= 100) {
      this.completeExercise();
    }
  }

  private calculateElapsedTime(start: Date): void {
    // Compute time difference in milliseconds
    let timeDiff = new Date().getTime() - start.getTime();

    // Convert time difference from milliseconds to seconds
    timeDiff = timeDiff / 1000;
    // Extract integer seconds that dont form a minute using %
    let seconds = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)
    // Pad seconds with a zero if neccessary
    let secondsAsString = seconds < 10 ? '0' + seconds : seconds + '';

    // Convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);
    // Extract integer minutes that don't form an hour using %
    let minutes = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
    // Pad minutes with a zero if neccessary
    let minutesAsString = minutes < 10 ? '0' + minutes : minutes + '';

    this.exerciseDurationTimeElapsed = minutesAsString + ':' + secondsAsString;
  }

  private completeExercise(): void {
    this._metronomeRef.stopMetronome();
    this.stopExercise();

    const dialogRef = this._matDialog.open(SaveExerciseProgressDialogComponent, {
      data: {
        mode: this.currentMode,
        exercise: this.exercise,
        initialStartBpm: this.initialStartBpm,
        initialNextBpm: this.initialNextBpm
      } as SaveExerciseProgressData
    });

    this._subscriptions$.add(
      dialogRef
        .afterClosed()
        .pipe(filter((saved) => saved))
        .subscribe(() => {
          this.exercise.progress.push({
            date: new Date(),
            initialBpm: this.initialStartBpm,
            usedBpm: this.exercise.currentBpm,
            nextBpm: this.exercise.nextBpm,
            mode: this.currentMode
          });
          this._isDirty = false;
          this._exercisesService.saveExercise(this.exercise).then(() => {
            this.stopExercise();
            this.registerNavbarActions(false);
            this._router.navigate(['/exercises']);
            this._snackbarService.show({
              message: translate<string>('saved')
            });
          });
        })
    );
  }

  private deleteExercise(): void {
    const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
      data: {
        title: translate<string>('delete_exercise_title'),
        content: translate<string>('delete_exercise_content', { value: this.exercise.name })
      } as DeletePopupDialogData
    });

    this._subscriptions$.add(
      dialogRef
        .afterClosed()
        .pipe(filter((saved) => saved))
        .subscribe(() => {
          this._exercisesService.deleteExercise(this.exercise.id).then(() => {
            this._router.navigate(['/exercises']);
          });
        })
    );
  }

  private registerNavbarActions(didPractice: boolean): void {
    const doneAction: INavbarAction = {
      order: 100,
      icon: 'done',
      action: () => this.completeExercise(),
      validator: () => this._metronomeRef.isValid
    };
    const editAction: INavbarAction = {
      order: 200,
      icon: 'edit',
      action: () => this._router.navigate(['/exercises/edit', this.exercise.id])
    };

    const deleteAction: INavbarAction = {
      order: 300,
      icon: 'delete',
      action: () => {
        this.deleteExercise();
      }
    };

    this._navbarActionService.registerActions([...(didPractice ? [doneAction] : []), editAction, deleteAction]);
  }
}
