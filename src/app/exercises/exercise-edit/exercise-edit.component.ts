import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { NgModel } from '@angular/forms';
import { UploadResult } from 'src/app/models/upload-result';
import { BottomSheetUploaderService } from './../../services/bottom-sheet-uploader.service';
import { translate } from '@ngneat/transloco';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ExercisesService } from 'src/app/exercises/services/exercises.service';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from './../../models/exercise';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MetronomeComponent } from 'src/app/shared/components/metronome/metronome.component';

@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.component.html',
  styleUrls: ['./exercise-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class ExerciseEditComponent implements OnInit {
  public exercise: Exercise;

  @ViewChild(MetronomeComponent) private _metronomeRef: MetronomeComponent;
  @ViewChild('exerciseNameModel') private _exerciseNameModel: NgModel;

  constructor(
    private _exercisesService: ExercisesService,
    private _activatedRoute: ActivatedRoute,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _authService: AuthService,
    private _bottomSheetUploaderService: BottomSheetUploaderService,
    public configurationService: ConfigurationService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => this._saveExercise(),
        validator: () => this.validate()
      },
      {
        order: 200,
        icon: 'upload_file',
        action: () => this.showFileUpload()
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

  public showFileUpload(): void {
    this._bottomSheetUploaderService.show({
      storageBucketPrefix: 'exercises',
      typesToUpload: [MediaTypes.IMAGE, MediaTypes.PDF, MediaTypes.SOUND],
      displayCameraOption: true,
      onUploadCallback: (result) => this._onFileUploadCompleted(result)
    });
  }

  public onSelectionChanged($event: StepperSelectionEvent): void {
    if (($event.selectedIndex == 2 || $event.selectedIndex == 3) && !$event.selectedStep.interacted) {
      this.showFileUpload();
    }
  }

  public removeAudio(): void {
    this.exercise.sound = null;
  }

  public removePicture(): void {
    this.exercise.pictureUrl = null;
  }

  public removePdf(): void {
    this.exercise.pdfUrl = null;
  }

  private _onFileUploadCompleted(result: UploadResult): void {
    switch (result.mediaType) {
      case MediaTypes.IMAGE:
        this.exercise.pictureUrl = result.downloadUrl;
        break;
      case MediaTypes.PDF:
        this.exercise.pdfUrl = result.downloadUrl;
        break;
      case MediaTypes.SOUND:
        this.exercise.sound = result.downloadUrl;
        break;
    }
  }

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

  private validate(): boolean {
    return this._metronomeRef && this._metronomeRef.isValid && this._exerciseNameModel.valid;
  }
}
