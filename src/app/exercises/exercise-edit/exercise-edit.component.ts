import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { ExercisesService } from 'src/app/exercises/services/exercises.service';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { UploadResult } from 'src/app/models/upload-result';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MetronomeComponent } from 'src/app/shared/components/metronome/metronome.component';
import { EncodeUriPipe } from 'src/app/shared/pipes/encode.pipe';
import { BottomSheetService } from '../../services/bottom-sheet.service';
import { Exercise } from './../../models/exercise';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-exercise-edit',
    standalone: true,
    imports: [
        EncodeUriPipe,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatStepperModule,
        MetronomeComponent,
        PdfJsViewerModule,
        TextFieldModule,
        TranslocoModule,
        ScrollingModule,
    ],
    templateUrl: './exercise-edit.component.html',
    styleUrls: ['./exercise-edit.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
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
        private _bottomSheetService: BottomSheetService,
        public configurationService: ConfigurationService,
    ) {
        this._navbarActionService.registerActions([
            {
                order: 100,
                icon: 'save',
                action: () => this._saveExercise(),
                validator: () => this.validate(),
            },
            {
                order: 200,
                icon: 'upload_file',
                action: () => this.showFileUpload(),
            },
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
        const bottomSheetRef: MatBottomSheetRef = this._bottomSheetService.showUpload({
            storageBucketPrefix: 'exercises',
            typesToUpload: [MediaTypes.IMAGE, MediaTypes.PDF, MediaTypes.SOUND],
            displayCameraOption: true,
            onUploadCallback: result => {
                this._onFileUploadCompleted(result);
                bottomSheetRef.dismiss();
            },
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
                    message: translate<string>('saved'),
                });
            });
        }
    }

    private validate(): boolean {
        return this._metronomeRef && this._metronomeRef.isValid && this._exerciseNameModel.valid;
    }
}
