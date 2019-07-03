import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Router } from '@angular/router';
import { PopupDialogData } from 'src/app/shared-ui/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared-ui/components/popup-dialog/popup-dialog.component';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song.model';
import { User } from '../../models/user.model';
import { SongService } from '../../songs/services/song.service';
import { GigService } from '../services/gig.service';
import { AuthService } from './../../services/auth.service';

@Component({
	selector: 'app-gig-edit',
	templateUrl: './gig-edit.component.html',
	styleUrls: [ './gig-edit.component.scss' ]
})
export class GigEditComponent implements OnInit {
	public gig: Gig;
	public allSongs: Song[];
	public selectedSongs: Song[];
	public filteredSongs: Song[];
	public filterToggle: boolean = false;
	public filterIcon: string = 'search';
	public isNewGig: boolean;

	public get isValidGig(): boolean {
		return this.gig.name && this.gig.songs.length > 0 && this._currentUser !== undefined;
	}

	@ViewChild(MatSelectionList) selection: MatSelectionList;

	private _gigService: GigService;
	private _songService: SongService;
	private _authService: AuthService;
	private _location: Location;
	private _router: Router;
	private _currentUser: User;
	private _matDialog: MatDialog;
	private _popupDialogData: PopupDialogData;

	constructor(
		gigService: GigService,
		songService: SongService,
		authService: AuthService,
		location: Location,
		matDialog: MatDialog,
		router: Router
	) {
		this._gigService = gigService;
		this._songService = songService;
		this._authService = authService;
		this._location = location;
		this._matDialog = matDialog;
		this._router = router;
	}

	ngOnInit() {
		this.gig = this._gigService.retrieveSelectedGig();
		if (this.gig === null || this.gig === undefined) {
			this.isNewGig = true;
		}
		if (!this.gig) {
			this.gig = new Gig('New Gig');
		}
		this._authService.user$.subscribe((user: User) => {
			this._currentUser = user;
			this._songService.getSongsForUser(user.uid).subscribe((songs: Song[]) => {
				this.allSongs = songs;
				this.filteredSongs = songs;
			});
		});
	}

	public checkSelected(song: Song) {
		return this.gig.songs.find((x) => x.id === song.id) !== undefined;
	}
	public onSelectionChange(event: MatSelectionListChange) {
		// song was added
		if (event.option.selected) {
			this.gig.songs.push(event.option.value as Song);
		} else {
			// song was removed
			this.gig.songs.splice(this.gig.songs.findIndex((x) => x.id === event.option.value.id), 1);
		}
	}

	public goBack(): void {
		if (this.isValidGig) {
			this.gig.uid = this._currentUser.uid;
			this._gigService.saveGig(this.gig);
		}
		this._location.back();
	}

	public searchForSong(searchString: string): void {
		this.filteredSongs = this.allSongs.filter((song) =>
			song.name.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	public clearSearch(): void {
		this.filteredSongs = this.allSongs;
	}

	public toggleFilter(): void {
		this.filterToggle ? (this.filterIcon = 'search') : (this.filterIcon = 'text_fields');
		this.filterToggle = !this.filterToggle;
		this.clearSearch();
	}

	public deleteGig(): void {
		this._popupDialogData = {
			title: 'Delete Gig?',
			content: `Do you really want to delete the Gig: ${this.gig.name} ?`
		};
		const dialogRef = this._matDialog.open(PopupDialogComponent, {
			data: this._popupDialogData
		});

		dialogRef.afterClosed().subscribe((result: Boolean) => {
			if (result) {
				this._gigService.deleteGig(this.gig.id).then(() => {
					this._router.navigate([ '/gigs' ]);
				});
			}
		});
	}
}
