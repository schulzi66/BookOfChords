import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { PopupDialogData } from 'src/app/shared-ui/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared-ui/components/popup-dialog/popup-dialog.component';
import { Song } from '../../models/song';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../services/song.service';

@Component({
	selector: 'app-songs-overview',
	templateUrl: './songs-overview.component.html',
	styleUrls: [ './songs-overview.component.scss' ]
})
export class SongsOverviewComponent implements OnInit {
	private _songService: SongService;
	private _router: Router;
	private _authService: AuthService;
	private _configurationService: ConfigurationService;
	private _matDialog: MatDialog;
	private _popupDialogData: PopupDialogData;

	public configuration: Configuration;

	public songs: Song[];
	public filteredSongs: Song[];

	constructor(
		songService: SongService,
		router: Router,
		authService: AuthService,
		configurationService: ConfigurationService,
		matDialog: MatDialog
	) {
		this._songService = songService;
		this._router = router;
		this._authService = authService;
		this._configurationService = configurationService;
		this._matDialog = matDialog;
	}

	ngOnInit() {
		this._authService.user$.subscribe((user: User) => {
			if (user) {
				this._songService.getSongsForUser(user.uid).subscribe((songs: Song[]) => {
					this.songs = songs;
					this.filteredSongs = songs;
				});
				this._configurationService
					.loadConfigurationForUser(user.uid)
					.subscribe((configuration: Configuration) => {
						this.configuration = configuration;
					});
			}
		});
	}

	public createNewSong(): void {
		this.removeSelectedSong();
		this._router.navigate([ '/edit-song' ]);
	}

	public setSelectedSong(song: Song): void {
		this._songService.storeSelectedSong(song);
	}

	public removeSelectedSong(): void {
		this._songService.removeSelectedSong();
	}

	public editSelectedSong(): void {
		this._router.navigate([ '/edit-song' ]);
	}

	public deleteSelectedSong(song: Song): void {
		this._popupDialogData = {
			title: 'Delete Song?',
			content: `Do you really want to delete the song: ${song.name} ?`
		};
		const dialogRef = this._matDialog.open(PopupDialogComponent, {
			data: this._popupDialogData
		});

		dialogRef.afterClosed().subscribe((result: Boolean) => {
			if (result) {
				this._songService.deleteSong(song.id);
			}
		});
	}

	public searchForSong(searchString: string): void {
		this.filteredSongs = this.songs.filter((song) => song.name.toLowerCase().includes(searchString.toLowerCase()));
	}

	public clearSearch(): void {
		this.filteredSongs = this.songs;
	}
}
