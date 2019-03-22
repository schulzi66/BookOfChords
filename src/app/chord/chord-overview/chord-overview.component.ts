import { Component, OnInit } from '@angular/core';
import { SongService } from '../services/song.service';
import { Song } from '../../models/song.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration.model';

@Component({
  selector: 'app-chord-overview',
  templateUrl: './chord-overview.component.html',
  styleUrls: ['./chord-overview.component.scss']
})
export class ChordOverviewComponent implements OnInit {

  private _songService: SongService;
  private _router: Router;
  private _authService: AuthService;
  private _configurationService: ConfigurationService;  

  public configuration: Configuration;
  public searchString: string;

  public songs: Song[];
  public filteredSongs: Song[];

  constructor(songService: SongService, router: Router, authService: AuthService, configurationService: ConfigurationService) {
    this._songService = songService;
    this._router = router;
    this._authService = authService;
    this._configurationService = configurationService;
  }

  ngOnInit() {
    this._authService.user$.subscribe((user: User) => {
      if(user){
        this._songService.getSongsForUser(user.uid)
                         .subscribe((songs: Song[]) => {
                            this.songs = songs;
                            this.filteredSongs = songs;
                         });
        this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
          this.configuration = configuration;
        })
      }
    });
  }

  public createNewSong(): void {
    this.removeSelectedSong();
    this._router.navigate(['/edit-song']);
  }

  public setSelectedSong(song: Song): void {
    this._songService.storeSelectedSong(song);
  }

  public removeSelectedSong(): void {
    this._songService.removeSelectedSong();
  }

  public editSelectedSong(): void {
    this._router.navigate(['/edit-song']);
  }

  public searchForSong(): void {
    if(this.searchString.length > 0) {
      this.filteredSongs = this.songs.filter(
          song => song.name.toLowerCase()
                           .includes(this.searchString.toLowerCase())
        );
    } else {
      this.clearSearch();
    }    
  }  
  
  public clearSearch(): void {
    this.filteredSongs = this.songs;
    this.searchString = '';
  }
}

