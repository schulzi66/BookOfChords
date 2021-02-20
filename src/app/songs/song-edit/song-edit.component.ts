import { UploadResult } from 'src/app/models/upload-result';
import { translate } from '@ngneat/transloco';
import { SnackbarService } from './../../services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GigService } from '../../gig/services/gig.service';
import { Song } from '../../models/song';
import { SongSection } from '../../models/song-section';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../services/song.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { BottomSheetUploaderService } from 'src/app/services/bottom-sheet-uploader.service';
import { MetronomeComponent } from 'src/app/shared/components/metronome/metronome.component';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class SongEditComponent implements OnInit {
  public song: Song;

  @ViewChild(MetronomeComponent) private _metronomeRef: MetronomeComponent;
  @ViewChild('songNameModel') private _songNameModel: NgModel;

  constructor(
    private _songService: SongService,
    private _authService: AuthService,
    private _gigService: GigService,
    private _activatedRoute: ActivatedRoute,
    private _navbarActionService: NavbarActionService,
    private _snackbarService: SnackbarService,
    private _bottomSheetUploaderService: BottomSheetUploaderService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.addNewSection()
      },
      {
        order: 200,
        icon: 'save',
        action: () => this.saveSong(),
        validator: () => this._metronomeRef && this._metronomeRef.isValid && this._songNameModel && this._songNameModel.valid
      },
      {
        order: 300,
        icon: 'upload_file',
        action: () => {
          this._bottomSheetUploaderService.show({
            storageBucketPrefix: 'songs',
            typesToUpload: [MediaTypes.IMAGE, MediaTypes.PDF],
            onUploadCallback: (result) => this.onUploadCompleted(result)
          });
        }
      }
    ]);
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['id'] !== '-1') {
      this.song = this._activatedRoute.snapshot.data['song'];
    } else {
      this.song = new Song('');
    }
  }

  public addNewSection(): void {
    this.song.sections.push(new SongSection());
  }

  public saveSong(): void {
    if (this.song.name && this._authService.user) {
      this.song.uid = this._authService.user.uid;
      this._songService.saveSong(this.song).then(() => {
        this._snackbarService.show({
          message: translate<string>('saved')
        });
      });
      this._gigService.updateSongInGigsForUser(this._authService.user.uid, this.song);
    }
  }

  public removeSection(index: number): void {
    this.song.sections.splice(index, 1);
  }

  public onTextAreaValueChanged(index: number, value: string): void {
    this.song.sections[index].value = value.split(/\r|\r\n|\n/);
  }

  public onUploadCompleted(result: UploadResult): void {
    if (result.mediaType === MediaTypes.PDF) {
      if (this.song.pdfs === undefined) {
        this.song.pdfs = [];
      }
      this.song.pdfs.push(result.downloadUrl);
    } else if (result.mediaType === MediaTypes.IMAGE) {
      if (this.song.pictures === undefined) {
        this.song.pictures = [];
      }
      this.song.pictures.push(result.downloadUrl);
    }
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
}
