import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Band } from 'src/app/models/band';
import { Setlist } from 'src/app/models/setlist';
import { Song } from 'src/app/models/song';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SongService } from 'src/app/songs/services/song.service';
import { BandService } from '../services/band.service';

@Component({
	selector: 'app-band-setlist-edit',
	templateUrl: './band-setlist-edit.component.html',
	styleUrls: [ './band-setlist-edit.component.scss' ]
})
export class BandSetlistEditComponent implements OnInit {
	private _activatedRoute: ActivatedRoute;
	private _bandService: BandService;
	private _authService: AuthService;
	private _currentUser: User;
	private _location: Location;
	private _songService: SongService;

	public band: Band;
	public setlist: Setlist;
	public allSongs: Song[];
	public selectedSongs: Song[];
	public filteredSongs: Song[];

	public constructor(
		activatedRoute: ActivatedRoute,
		bandService: BandService,
		authService: AuthService,
		location: Location,
		songService: SongService
	) {
		this._activatedRoute = activatedRoute;
		this._bandService = bandService;
		this._authService = authService;
		this._location = location;
		this._songService = songService;
		this.setlist = new Setlist();
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
			this._activatedRoute.params.subscribe((params: { id?: string }) => {
				this._bandService.getBandByBandId(null).subscribe((band: Band) => {
					if (band !== undefined) {
						this.band = band;
						if (params.id !== '-1') {
							this.setlist = this.band.setlists.find((x) => x.id === params.id);
						}
						this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
							this.allSongs = songs;
							this.filteredSongs = songs;
						});
					} else {
						this._location.back();
					}
				});
			});
		});
	}

	public goBack(): void {
		this._bandService.saveSetlistForBand(this.band, this.setlist);
		this._location.back();
	}

	public onDescriptionChanged(description: string): void {
		this.setlist.description = description;
	}

	public searchForSong(searchString: string): void {
		this.filteredSongs = this.allSongs.filter((song) =>
			song.name.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	public clearSearch(): void {
		this.filteredSongs = this.allSongs;
	}

	public checkSelected(song: Song): boolean {
		if (this.setlist.songs) {
			return this.setlist.songs.find((x) => x === song.name) !== undefined;
		} else {
			return false;
		}
	}

	public onSelectionChange(event: MatSelectionListChange) {
		// song was added
		if (event.option.selected) {
			this.setlist.songs.push((event.option.value as Song).name);
		} else {
			// song was removed
			this.setlist.songs.splice(this.setlist.songs.findIndex((x) => x === (event.option.value as Song).name), 1);
		}
	}

	public onImageUploadCompleted($event: string): void {
		if ($event.includes('.pdf?')) {
			this.setlist.pdfUrl = $event;
		}
	}

	public importSetlist(): void {
		console.log('awesome feature incoming');
	}

	public drop(event: CdkDragDrop<Song>) {
		moveItemInArray(this.setlist.songs, event.previousIndex, event.currentIndex);
	}
}
