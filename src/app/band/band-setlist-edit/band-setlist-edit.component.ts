import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { Band } from 'src/app/models/band';
import { Gig } from 'src/app/models/gig';
import { Setlist } from 'src/app/models/setlist';
import { Song } from 'src/app/models/song';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RockNRollSnackbarComponent } from 'src/app/shared-ui/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { SongService } from 'src/app/songs/services/song.service';
import { BandService } from '../services/band.service';
import { GigService } from './../../gig/services/gig.service';

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
	private _gigService: GigService;
    private _snackBar: MatSnackBar;
    private _router: Router;

	public band: Band;
	public setlist: Setlist;
	public allSongsOfCurrentUser: Song[];
	public selectedSongs: Song[];
	public filteredSongs: Song[];

	public constructor(
		activatedRoute: ActivatedRoute,
		bandService: BandService,
		authService: AuthService,
		location: Location,
		songService: SongService,
		gigService: GigService,
        snackBar: MatSnackBar,
        router: Router
	) {
		this._activatedRoute = activatedRoute;
		this._bandService = bandService;
		this._authService = authService;
		this._location = location;
		this._songService = songService;
		this._gigService = gigService;
        this._snackBar = snackBar;
        this._router = router;
        this.setlist = new Setlist();        
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
			this._activatedRoute.params.subscribe((params: { id?: string }) => {
				if (this._currentUser.bandId) {
					this._bandService.getBandByBandId(this._currentUser.bandId).subscribe((band: Band) => {
						if (band !== undefined) {
							this.band = band;
							if (params.id !== '-1') {
								this.setlist = this.band.setlists.find((x) => x.id === params.id);
							}
							this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
								this.allSongsOfCurrentUser = songs;
								this.filteredSongs = songs;
							});
						} else {
							this._location.back();
						}
					});
				}
			});
		});
	}

	public goBack(): void {
		this._router.navigate([ '/band' ]);
	}

	public onNameChanged(): void {
		this.saveIfValid();
	}

	public onDescriptionChanged(description: string): void {
		this.setlist.description = description;
		this.saveIfValid();
	}

	public searchForSong(searchString: string): void {
		this.filteredSongs = this.allSongsOfCurrentUser.filter((song) =>
			song.name.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	public clearSearch(): void {
		this.filteredSongs = this.allSongsOfCurrentUser;
	}

	public checkSelected(song: Song): boolean {
		if (this.setlist.songs) {
			return this.setlist.songs.find((x) => x === song.name) !== undefined;
		} else {
			return false;
		}
	}

	public onSelectionChange(event: MatSelectionListChange) {
		if (event.option.selected) {
			this.setlist.songs.push((event.option.value as Song).name);
		} else {
			this.setlist.songs.splice(this.setlist.songs.findIndex((x) => x === (event.option.value as Song).name), 1);
		}
		this.saveIfValid();
	}

	public onImageUploadCompleted($event: string): void {
		if ($event.includes('.pdf?')) {
			this.setlist.pdfUrl = $event;
			this.saveIfValid();
		}
	}

	public exportSetlistAsGig(): void {
		let gig = new Gig(this.setlist.name);
		gig.uid = this._currentUser.uid;

		this.setlist.songs.forEach((setlistSong) => {
			const song = this.allSongsOfCurrentUser.find(
				(x) => x.name.toLowerCase().trim() === setlistSong.toLowerCase().trim()
			);
			if (song) {
				//User has already this song in his book of chords and song should be added to new gig
				gig.songs.push(song);
			} else {
				//New song will be created and added to the gig without chords
				let newSong = new Song(setlistSong);
				newSong.uid = this._currentUser.uid;
				gig.songs.push(newSong);
				this._songService.saveSong(newSong);
			}
		});
		this._gigService.saveGig(gig);
		this._snackBar.openFromComponent(RockNRollSnackbarComponent, {
			data: {
                message: translate<string>('snackbar_data'),
                route: 'gigs'
            } 
		});
	}

	public drop(event: CdkDragDrop<Song>) {
		moveItemInArray(this.setlist.songs, event.previousIndex, event.currentIndex);
		this.saveIfValid();
	}

	private saveIfValid(): void {
		if (this.setlist.name) {
			this._bandService.saveSetlistForBand(this.band, this.setlist);
		}
	}
}
