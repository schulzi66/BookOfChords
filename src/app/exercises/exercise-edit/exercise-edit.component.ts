import { BottomSheetUploaderService } from './../../services/bottom-sheet-uploader.service';
import { translate } from '@ngneat/transloco';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ExercisesService } from 'src/app/exercises/services/exercises.service';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from './../../models/exercise';
import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { BottomSheetUploaderAllowedTypes } from 'src/app/shared/components/bottom-sheet-uploader/bottom-sheet-uploader.component';

@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.component.html',
  styleUrls: ['./exercise-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseEditComponent implements OnInit {
  public exercise: Exercise;
  public showUpload: boolean = true;

  constructor(
    private _exercisesService: ExercisesService,
    private _activatedRoute: ActivatedRoute,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _authService: AuthService,
    private _bottomSheetUploaderService: BottomSheetUploaderService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => this._saveExercise()
      },
      {
        order: 200,
        icon: 'attach_file',
        action: () => {
          this._bottomSheetUploaderService.show({
            typesToUpload: [BottomSheetUploaderAllowedTypes.IMAGE, BottomSheetUploaderAllowedTypes.PDF]
          });
          //   this.showUpload = !this.showUpload;
        }
      }
    ]);
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['id'] !== '-1') {
      this.exercise = this._activatedRoute.snapshot.data['exercise'];
    } else {
      this.exercise = new Exercise();
    }
  }

  public onFileUploadCompleted($event: string): void {}

  private _saveExercise(): void {
    if (this.exercise.name && this._authService.user) {
      this.exercise.uid = this._authService.user.uid;
      this._exercisesService.saveExercise(this.exercise).then(() => {
        this._snackbarService.show({
          message: translate<string>('saved')
        });
      });
    }
  }
}
