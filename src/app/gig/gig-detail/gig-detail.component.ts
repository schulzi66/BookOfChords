import { User } from './../../models/user.model';
import { AuthService } from './../../services/auth.service';
import {Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song.model';
import { Router } from '@angular/router';
import { GigService } from '../services/gig.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration.model';

@Component({
  selector: 'app-gig-detail',
  templateUrl: './gig-detail.component.html',
  styleUrls: ['./gig-detail.component.scss']
})
export class GigDetailComponent implements OnInit {

  private _router: Router;
  private _gigService: GigService;  
  private _location: Location;
  private _orderChanged: boolean;
  private _authService: AuthService;
  private _configurationService: ConfigurationService;

  public configuration: Configuration;
  public gig: Gig;
  public songs: Song[];

  constructor(router: Router, gigService: GigService, location: Location, authService: AuthService, configurationServcie: ConfigurationService) { 
    this._router = router;
    this._gigService = gigService;
    this._location = location;
    this._configurationService = configurationServcie;
    this._authService = authService;
  }
  
  ngOnInit() {
    this.gig = this._gigService.retrieveSelectedGig();
    if(!this.gig) {      
      this._router.navigate(['/gigs']);
    }    
    this._authService.user$.subscribe((user: User) => {
      this._configurationService.loadConfigurationForUser(user.uid).subscribe((configuration: Configuration) => {
        this.configuration = configuration;
      })
    })
    this._orderChanged = false;
  }

  public goBack(): void {
    if(this._orderChanged) {
      this._gigService.saveGig(this.gig);
    }
    this._location.back();
  }

  public drop(event: CdkDragDrop<Song>) {    
    this._orderChanged = true;
    moveItemInArray(this.gig.songs, event.previousIndex, event.currentIndex);
  }
}
