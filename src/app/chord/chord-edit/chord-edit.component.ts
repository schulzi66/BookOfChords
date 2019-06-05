import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SongSection } from '../../models/song-section.model';
import { User } from '../../models/user.model';
import { SongService } from '../services/song.service';
import { GigService } from './../../gig/services/gig.service';
import { Song } from './../../models/song.model';
import { AuthService } from './../../services/auth.service';

@Component({
    selector: 'app-chord-edit',
    templateUrl: './chord-edit.component.html',
    styleUrls: ['./chord-edit.component.scss']
})
export class ChordEditComponent implements OnInit {

    public song: Song;

    private _location: Location;
    private _songService: SongService;
    private _authService: AuthService;
    private _currentUser: User;
    private _gigService: GigService;

    constructor(location: Location, songService: SongService, authService: AuthService, gigService: GigService) {
        this._location = location;
        this._songService = songService;
        this._authService = authService;
        this._gigService = gigService;
    }

    ngOnInit() {
        this._authService.user$.subscribe((user: User) => {
            this._currentUser = user;
        });
        this.song = this._songService.retrieveSelectedSong();
        if (!this.song) {
            this.song = new Song('');
        }
    }

    public addNewSection(): void {
        this.song.sections.push(new SongSection());
    }

    public goBack(): void {
        if (this.song.name && this._currentUser) {
            this.song.uid = this._currentUser.uid;
            this._songService.saveSong(this.song);
            this._gigService.updateSongInGigsForUser(this._currentUser.uid, this.song);
        }
        this._location.back();
    }

    public removeSection(index: number): void {
        this.song.sections.splice(index, 1);
    }

    public onTextAreaValueChanged(index: number, value: string): void {
        this.song.sections[index].value = value.split(/\r|\r\n|\n/);
    }

    public onImageUploadCompleted($event: string): void {
        if (this.song.pictures === undefined) {
            this.song.pictures = [];
        }
        this.song.pictures.push($event);
    }

    public removePicture(index: number): void {
        this.song.pictures.splice(index, 1);
    }
}
