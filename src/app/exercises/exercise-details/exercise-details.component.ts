import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { filter } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Exercise } from 'src/app/models/exercise';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StatsService } from 'src/app/services/stats.service';
import { DeletePopupDialogData } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog-data';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { ExerciseModes } from './../../models/exercise-mode.enum';
import { INavbarAction } from './../../models/navbar-action';
import { DrawerActionService } from './../../services/drawer-action.service';
import { DeletePopupDialogComponent } from './../../shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { MetronomeComponent } from './../../shared/components/metronome/metronome.component';
import { PinchZoomComponent } from './../../shared/components/pinch-zoom/pinch-zoom.component';
import { EncodeUriPipe } from './../../shared/pipes/encode.pipe';
import { ExercisesService } from './../services/exercises.service';
import { SaveExerciseProgressData } from './save-exercise-progress-dialog/save-exercise-progress-data';
import { SaveExerciseProgressDialogComponent } from './save-exercise-progress-dialog/save-exercise-progress-dialog.component';

@Component({
    selector: 'app-exercise-details',
    standalone: true,
    imports: [
        CommonModule,
        EncodeUriPipe,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MetronomeComponent,
        PdfJsViewerModule,
        PinchZoomComponent,
        SaveExerciseProgressDialogComponent,
        TranslocoModule,
        ScrollingModule,
    ],
    templateUrl: './exercise-details.component.html',
    styleUrls: ['./exercise-details.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class ExerciseDetailsComponent extends SubscriptionHandler implements OnInit, AfterViewInit, OnDestroy {
    private readonly _minuteInMs: number = 60000;
    private _timerHandle: number;
    private _isDirty: boolean;
    private _start: Date;
    private _current: Date;
    private _pauseTime: number;
    private _pauseIntervalTime: number;
    private _next: Date;
    private _end: Date;
    private _timeDiff: number;

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
        private readonly _statsService: StatsService,
        private readonly _authService: AuthService,
        public readonly configurationService: ConfigurationService,
    ) {
        super();
        this.intervalDurationPercentage = 100;
        this.exerciseDurationTimeElapsed = '00:00';
        this._isDirty = false;
        this.isPracticing = false;
        this._timeDiff = 0;
        this._pauseTime = 0;
        this._pauseIntervalTime = 0;

        this.registerNavbarActions(false);
        this._drawerActionService.preDrawerAction = () => {
            if (this._isDirty) {
                this.exercise.currentBpm = this.initialStartBpm;
                this.exercise.nextBpm = this.initialNextBpm;
            }
        };
    }

    public ngOnInit(): void {
        this._statsService.saveStats({
            uid: this._authService.user.uid,
            userName: this._authService.user.displayName,
            date: new Date(),
            path: 'exercises-details',
        });
        this.exercise = this._activatedRoute.snapshot.data['exercise'];
        this.currentMode = Number.parseInt(this._activatedRoute.snapshot.params['mode']) as ExerciseModes;
        this.initialStartBpm = this.exercise.currentBpm;
        this.initialNextBpm = this.exercise.nextBpm;
    }

    public ngAfterViewInit(): void {
        this._metronomeRef.onBpmChanged.subscribe(_ => (this._isDirty = true));
    }

    public ngOnDestroy(): void {
        this.stopExercise();
    }

    public startExercise(): void {
        this.isPracticing = true;
        if (this._pauseTime > 0) {
            this._pauseTime = this._pauseIntervalTime = new Date().getTime() - this._pauseTime;
        }
        switch (this.currentMode) {
            case ExerciseModes.INTERVAL:
                if (this.exercise.duration && this.exercise.intervalCount && this.exercise.currentBpm && this.exercise.nextBpm) {
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

    public pauseExercise(): void {
        this._pauseTime = this._pauseIntervalTime = new Date().getTime() - this._pauseTime;
        window.clearInterval(this._timerHandle);
    }

    public stopExercise(): void {
        this.isPracticing = false;
        this._start = undefined;
        this._current = undefined;
        this._next = undefined;
        this._pauseTime = this._pauseIntervalTime = 0;
        this._end = undefined;
        this.exerciseDurationPercentage = 0;
        this.exerciseDurationTimeElapsed = '00:00';
        window.clearInterval(this._timerHandle);
    }

    private startIntervalMode(): void {
        this._start = this._start ? this._start : new Date();
        this._current = this._current ? this._current : new Date();
        const intervalDuration = (this.exercise.duration * this._minuteInMs) / this.exercise.intervalCount;
        this._next = this._next ? this._next : new Date(this._start.getTime() + intervalDuration);
        this._end = this._end ? this._end : new Date(this._start.getTime() + this.exercise.duration * this._minuteInMs);
        const increasePerInterval = Math.round((this.exercise.nextBpm - this.exercise.currentBpm) / (this.exercise.intervalCount - 1));
        this._timerHandle = window.setInterval(() => {
            this.handleTotalExerciseProgress(this._start, this._end);
            if (this._current >= this._next) {
                this._metronomeRef.changeSpeed(this.exercise.currentBpm + increasePerInterval);
                this.intervalDurationPercentage = 100;
                this._next = new Date(this._current.getTime() + intervalDuration);
            } else {
                this.intervalDurationPercentage =
                    100 -
                    Math.round(
                        ((new Date().getTime() - this._current.getTime() - this._pauseIntervalTime) /
                            (this._next.getTime() - this._current.getTime())) *
                            100,
                    );

                if (this.intervalDurationPercentage <= 0) {
                    this._current = new Date();
                    this._pauseIntervalTime = 0;
                }
            }
        }, 1000);
    }

    private startTimebasedMode(): void {
        this._start = this._start ? this._start : new Date();
        this._end = this._end ? this._end : new Date(this._start.getTime() + this.exercise.duration * this._minuteInMs);
        this._timerHandle = window.setInterval(() => {
            this.handleTotalExerciseProgress(this._start, this._end);
        }, 1000);
    }

    private handleTotalExerciseProgress(start: Date, end: Date): void {
        this.calculateElapsedTime(start);

        this.exerciseDurationPercentage = Math.round(
            ((new Date().getTime() - start.getTime() - this._pauseTime) / (end.getTime() - start.getTime())) * 100,
        );
        if (this.exerciseDurationPercentage >= 100) {
            this.completeExercise();
        }
    }

    private calculateElapsedTime(start: Date): void {
        // Compute time difference in milliseconds
        this._timeDiff = new Date().getTime() - start.getTime() - this._pauseTime;

        // Convert time difference from milliseconds to seconds
        this._timeDiff = this._timeDiff / 1000;
        // Extract integer seconds that dont form a minute using %
        const seconds = Math.floor(this._timeDiff % 60); // ignoring uncomplete seconds (floor)
        // Pad seconds with a zero if neccessary
        const secondsAsString = seconds < 10 ? '0' + seconds : seconds + '';

        // Convert time difference from seconds to minutes using %
        this._timeDiff = Math.floor(this._timeDiff / 60);
        // Extract integer minutes that don't form an hour using %
        const minutes = this._timeDiff % 60; // no need to floor possible incomplete minutes, becase they've been handled as seconds
        // Pad minutes with a zero if neccessary
        const minutesAsString = minutes < 10 ? '0' + minutes : minutes + '';

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
                initialNextBpm: this.initialNextBpm,
            } as SaveExerciseProgressData,
        });

        this._subscriptions$.add(
            dialogRef
                .afterClosed()
                .pipe(filter(saved => saved))
                .subscribe(() => {
                    this.exercise.progress.push({
                        date: new Date(),
                        initialBpm: this.initialStartBpm,
                        usedBpm: this.exercise.currentBpm,
                        nextBpm: this.exercise.nextBpm,
                        mode: this.currentMode,
                    });
                    this._isDirty = false;
                    this._exercisesService.saveExercise(this.exercise).then(() => {
                        this.stopExercise();
                        this.registerNavbarActions(false);
                        this._router.navigate(['/exercises']);
                        this._snackbarService.show({
                            message: translate<string>('saved'),
                        });
                    });
                }),
        );
    }

    private deleteExercise(): void {
        const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
            data: {
                title: translate<string>('delete_exercise_title'),
                content: translate<string>('delete_exercise_content', { value: this.exercise.name }),
            } as DeletePopupDialogData,
        });

        this._subscriptions$.add(
            dialogRef
                .afterClosed()
                .pipe(filter(saved => saved))
                .subscribe(() => {
                    this._exercisesService.deleteExercise(this.exercise.id).then(() => {
                        this._router.navigate(['/exercises']);
                    });
                }),
        );
    }

    private registerNavbarActions(didPractice: boolean): void {
        const doneAction: INavbarAction = {
            order: 100,
            icon: 'done',
            action: () => this.completeExercise(),
            validator: () => this._metronomeRef.isValid,
        };
        const editAction: INavbarAction = {
            order: 200,
            icon: 'edit',
            action: () => this._router.navigate(['/exercises/edit', this.exercise.id]),
        };

        const deleteAction: INavbarAction = {
            order: 300,
            icon: 'delete',
            action: () => {
                this.deleteExercise();
            },
        };

        this._navbarActionService.registerActions([...(didPractice ? [doneAction] : []), editAction, deleteAction]);
    }
}
