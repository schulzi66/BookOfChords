import { SnackbarService } from './../../services/snackbar.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from './../services/song.service';
import { Component, OnInit } from '@angular/core';
import { Song } from 'src/app/models/song';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { ClipboardService } from 'ngx-clipboard';
import { translate } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogComponent } from 'src/app/shared/components/popup-dialog/popup-dialog.component';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-song-detailsview',
  templateUrl: './song-detailsview.component.html',
  styleUrls: ['./song-detailsview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class SongDetailsviewComponent implements OnInit {
  public song: Song;

  constructor(
    private _songService: SongService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _navbarActionService: NavbarActionService,
    private _matDialog: MatDialog,
    private _clipboardService: ClipboardService,
    private _snackbarService: SnackbarService,
    public configurationService: ConfigurationService
  ) {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'edit',
        action: () => this._router.navigate(['./songs/edit', this.song.id])
      },
      {
        order: 200,
        icon: 'content_copy',
        action: () => this.copySelectedSong()
      },
      {
        order: 300,
        icon: 'delete_outline',
        action: () => this.deleteSong()
      }
    ]);
  }

  ngOnInit() {
    this.song = this._activatedRoute.snapshot.data['song'];
  }

  public copySelectedSong(): void {
    let songContent: string = '';
    songContent += this.song.name + '\n\n';
    this.song.sections.forEach((section) => {
      songContent += section.name + '\n';
      section.value.forEach((value) => {
        songContent += value + '\n';
      });
      songContent += '\n';
    });
    this._clipboardService.copy(songContent);
    this._snackbarService.show({ message: translate<string>('snackbar_copied_data') });
  }

  public deleteSong(): void {
    const dialogRef = this._matDialog.open(PopupDialogComponent, {
      data: {
        title: 'Delete Song?',
        content: `Do you really want to delete the song: ${this.song.name} ?`
      }
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this._songService.deleteSong(this.song.id);
      }
    });
  }
}
