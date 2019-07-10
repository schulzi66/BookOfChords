import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GigService } from '../../gig/services/gig.service';
import { SongSection } from '../../models/song-section.model';
import { Song } from '../../models/song.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../services/song.service';

@Component({
	selector: 'app-song-detailsview',
	templateUrl: './song-detailsview.component.html',
	styleUrls: [ './song-detailsview.component.scss' ]
})
export class SongDetailsviewComponent implements OnInit {
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

	// public get pdfFromSong(): string[] {
	// 	let pdfs: string[] = [];
	//     this.song.pdfs.forEach((pdf) => {
	// 		pdfs.push(this._sanitizer.bypassSecurityTrustResourceUrl(pdf) as string);
	// 	});
	// 	return pdfs;
	// }

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
