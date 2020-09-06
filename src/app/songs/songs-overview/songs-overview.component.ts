import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { ClipboardService } from 'ngx-clipboard';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { PopupDialogComponent } from 'src/app/shared/components/popup-dialog/popup-dialog.component';
import { RockNRollSnackbarComponent } from 'src/app/shared/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { Song } from '../../models/song';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../services/song.service';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-songs-overview',
  templateUrl: './songs-overview.component.html',
  styleUrls: ['./songs-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class SongsOverviewComponent implements OnInit, OnDestroy {
  public filteredSongs: Song[];

  private _songs: Song[];
  private _subscriptions$: Subscription;

  public i: number;

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(
    public _songService: SongService,
    private _router: Router,
    private _authService: AuthService,
    private _matDialog: MatDialog,
    private _clipboardService: ClipboardService,
    private _snackBar: MatSnackBar,
    private _navbarActionService: NavbarActionService,
    private _activatedRoute: ActivatedRoute,
    public configurationService: ConfigurationService
  ) {
    this._subscriptions$ = new Subscription();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'add',
        action: () => this.createNewSong()
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(
      this._songService.songs$.subscribe((songs: Song[]) => {
        this._songs = songs;
        this.filteredSongs = songs;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public createNewSong(): void {
    this._router.navigate(['./songs/edit', -1]);
  }

  public searchForSong(searchString: string): void {
    this.filteredSongs = this._songs.filter((song) => song.name.toLowerCase().includes(searchString.toLowerCase()));
  }

  public clearSearch(): void {
    this.filteredSongs = this._songs;
  }
}
