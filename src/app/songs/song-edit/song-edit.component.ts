import { ActivatedRoute } from '@angular/router';
import { INavbarAction } from '../../models/navbar-action';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GigService } from '../../gig/services/gig.service';
import { Song } from '../../models/song';
import { SongSection } from '../../models/song-section';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../services/song.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrls: ['./song-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class SongEditComponent implements OnInit {
  public song: Song;
  public showUpload: boolean = false;

  constructor(
    private _songService: SongService,
    private _authService: AuthService,
    private _gigService: GigService,
    private _activatedRoute: ActivatedRoute,
    private _navbarActionService: NavbarActionService
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
        action: () => this.saveSong()
      },
      {
        order: 300,
        icon: 'attach_file',
        action: () => {
          this.showUpload = !this.showUpload;
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
      this._songService.saveSong(this.song);
      this._gigService.updateSongInGigsForUser(this._authService.user.uid, this.song);
    }
  }

  public removeSection(index: number): void {
    this.song.sections.splice(index, 1);
  }

  public onTextAreaValueChanged(index: number, value: string): void {
    this.song.sections[index].value = value.split(/\r|\r\n|\n/);
  }

  public onImageUploadCompleted($event: string): void {
    if ($event.includes('.pdf?')) {
      if (this.song.pdfs === undefined) {
        this.song.pdfs = [];
      }
      this.song.pdfs.push($event);
    } else {
      if (this.song.pictures === undefined) {
        this.song.pictures = [];
      }
      this.song.pictures.push($event);
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
