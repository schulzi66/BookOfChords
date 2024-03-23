import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { Observable, take } from 'rxjs';
import { BandService } from 'src/app/band/services/band.service';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { UploadResult } from 'src/app/models/upload-result';
import { BottomSheetService } from 'src/app/services/bottom-sheet.service';
import { DrawerActionService } from 'src/app/services/drawer-action.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { ToneService } from 'src/app/services/tone.service';
import { GigService } from '../../gig/services/gig.service';
import { Song } from '../../models/song';
import { SongSection } from '../../models/song-section';
import { AuthService } from '../../services/auth.service';
import { EncodeUriPipe } from '../../shared/pipes/encode.pipe';
import { SongService } from '../services/song.service';
import { SnackbarService } from './../../services/snackbar.service';
import { PinchZoomComponent } from './../../shared/components/pinch-zoom/pinch-zoom.component';
import { StringArrayLinesPipe } from './../../shared/pipes/string-array-lines.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
    selector: 'app-song-edit',
    standalone: true,
    imports: [
        CommonModule,
        DragDropModule,
        EncodeUriPipe,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        PdfJsViewerModule,
        PinchZoomComponent,
        StringArrayLinesPipe,
        TranslocoModule,
        ScrollingModule
    ],
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class SongEditComponent implements OnInit {
    private initialSong: Song;
    private resetSong: boolean;
    public song: Song;
    public isReoderingMode: boolean;
    public isDeletingMode: boolean;
    public selectedBand: Band;
    public bands$: Observable<Array<Band>>

    @ViewChild('songNameModel') private _songNameModel: NgModel;
    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    constructor(
        private readonly _songService: SongService,
        private readonly _authService: AuthService,
        private readonly _gigService: GigService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _navbarActionService: NavbarActionService,
        private readonly _snackbarService: SnackbarService,
        private readonly _bottomSheetService: BottomSheetService,
        private readonly _drawerActionService: DrawerActionService,
        private readonly _toneService: ToneService,
        private readonly _ngZone: NgZone,
        public readonly bandService: BandService,
        public readonly configurationService: ConfigurationService,
    ) {
        this._navbarActionService.registerActions([
            {
                order: 100,
                icon: 'save',
                action: () => this.saveSong(),
                validator: () => this._songNameModel && this._songNameModel.valid && this._toneService.isValidBpm(this.song.bpm),
            },
            {
                order: 200,
                icon: 'add',
                action: () => this.addNewSection(),
            },
            {
                order: 300,
                icon: 'delete',
                action: () => {
                    this.isDeletingMode = !this.isDeletingMode;
                    this.isReoderingMode = false;
                },
            },
            {
                order: 400,
                icon: 'drag_handle',
                action: () => {
                    this.isReoderingMode = !this.isReoderingMode;
                    this.isDeletingMode = false;
                },
            },
            {
                order: 500,
                icon: 'upload_file',
                action: () => {
                    this._bottomSheetService.showUpload({
                        storageBucketPrefix: 'songs',
                        typesToUpload: [MediaTypes.IMAGE, MediaTypes.PDF, MediaTypes.SOUND],
                        onUploadCallback: result => this.onUploadCompleted(result),
                    });
                },
            },
        ]);

        this._drawerActionService.preDrawerAction = () => {
            if (this.resetSong) {
                const songIndex = this._songService.songs.findIndex((x: Song) => x.id === this.song.id);
                this._songService.songs[songIndex] = this.initialSong;
                this.resetSong = false;
            }
        };
    }

    ngOnInit() {
        if (this._activatedRoute.snapshot.params['id'] !== '-1') {
            this.song = this._activatedRoute.snapshot.data['song'];
        } else {
            this.song = new Song('');
        }
        this.bands$ = this.bandService.getBands();
        this.song.bpm = this.song.bpm ?? 40;
        this.initialSong = JSON.parse(JSON.stringify(this.song));
        this.resetSong = true;
        this.isReoderingMode = false;
        this.isDeletingMode = false;
        this.bands$.subscribe(band => this.selectedBand = band.find((band: Band) => band.id === this.song.bandId))
        this.triggerResize();
    }

    public addNewSection(): void {
        this.song.sections.push(JSON.parse(JSON.stringify(new SongSection())));
    }

    public saveSong(): void {
        this._drawerActionService.disabled = true;

        if (this.song.name && this._authService.user) {
            this.song.uid = this._authService.user.uid;
            this._songService.saveSong(this.song).then(async () => {
                await this._gigService.updateSongInGigsForUser(this._authService.user.uid, this.song);

                this.resetSong = false;
                this._snackbarService.show({
                    message: translate<string>('saved'),
                });
                this._drawerActionService.disabled = false;
            });
        }
    }

    public removeSection(index: number): void {
        this.song.sections.splice(index, 1);
    }

    public onTextAreaValueChanged(index: number, value: string): void {
        this.song.sections[index].value = value.split(/\r|\r\n|\n/);
    }

    public onUploadCompleted(result: UploadResult): void {
        switch (result.mediaType) {
            case MediaTypes.PDF:
                if (this.song.pdfs === undefined) {
                    this.song.pdfs = [];
                }
                this.song.pdfs.push(result.downloadUrl);
                break;

            case MediaTypes.IMAGE:
                if (this.song.pictures === undefined) {
                    this.song.pictures = [];
                }
                this.song.pictures.push(result.downloadUrl);
                break;

            case MediaTypes.SOUND:
                this.song.sound = result.downloadUrl;
                break;
        }
    }

    public removeAudio(): void {
        this.song.sound = null;
    }

    public removePicture(index: number): void {
        this.song.pictures.splice(index, 1);
    }

    public removePdf(index: number): void {
        this.song.pdfs.splice(index, 1);
    }

    public updateBpm(newBpm: number): void {
        this.song.bpm = newBpm;
    }

    public drop(event: CdkDragDrop<Song>): void {
        moveItemInArray(this.song.sections, event.previousIndex, event.currentIndex);
    }

    public selectBand(band: Band): void {
        this.selectedBand = band;
        this.song.bandId = band.id;
    }

    public deselectBand(): void {
        this.selectedBand = undefined;
        this.song.bandId = undefined;
    }

    private triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
    }
}
