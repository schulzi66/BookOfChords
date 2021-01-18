import { SubscriptionHandler } from '../../shared/helper/subscription-handler';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Song } from '../../models/song';
import { SongService } from '../services/song.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-songs-overview',
  templateUrl: './songs-overview.component.html',
  styleUrls: ['./songs-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class SongsOverviewComponent extends SubscriptionHandler implements OnInit {
  public filteredSongs: Song[];

  private _songs: Song[];

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(
    public _songService: SongService,
    private _router: Router,
    private _navbarActionService: NavbarActionService,
    public configurationService: ConfigurationService
  ) {
    super();
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
