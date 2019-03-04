import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Gig } from '../../models/gig';
import { GigService } from '../services/gig.service';
import { Song } from '../../models/song.model';
import { SongService } from '../../chord/services/song.service';
import { User } from '../../models/user.model';
import { Location } from '@angular/common';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';


@Component({
  selector: 'app-gig-edit',
  templateUrl: './gig-edit.component.html',
  styleUrls: ['./gig-edit.component.scss']
})
export class GigEditComponent implements OnInit {
  
  public gig: Gig;
  public allSongs: Song[];  
  public selectedSongs: Song[];

  @ViewChild(MatSelectionList) selection: MatSelectionList;

  private _gigService: GigService;
  private _songService: SongService;
  private _authService: AuthService;
  private _location: Location;
  private _currentUser: User;

  constructor(gigService: GigService, songService: SongService, authService: AuthService, location: Location) {
    this._gigService = gigService;
    this._songService = songService;
    this._authService = authService;
    this._location = location;
  }
  
  ngOnInit() {        
    this.gig = this._gigService.retrieveSelectedGig();
    if(!this.gig) {
      this.gig = new Gig('');
    }
    this._authService.user$.subscribe((user: User) => {
      this._currentUser = user;
      this._songService.getSongsForUser(user.uid)
                       .subscribe((songs: Song[]) => {
                         this.allSongs = songs;                                
                       });
    })    
  }  

  public checkSelected(song: Song) {    
    return this.gig.songs.find(x => x.id === song.id) != undefined;         
  }
  public onSelectionChange(event: MatSelectionListChange) {
    //song was added
    if(event.option.selected) {
      this.gig.songs.push((event.option.value as Song));      
    } else { //song was removed
      this.gig.songs.splice(this.gig.songs.findIndex(x => x.id === event.option.value.id), 1);      
    }
  }

  public goBack(): void {
    if(this.gig.name && this._currentUser) {      
      this.gig.uid = this._currentUser.uid;
      this._gigService.saveGig(this.gig);
    }
    this._location.back();
  }
}
