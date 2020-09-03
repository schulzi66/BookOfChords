import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { GigService } from '../services/gig.service';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { SongService } from './../../songs/services/song.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';

@Component({
  selector: 'app-gig-detail',
  templateUrl: './gig-detail.component.html',
  styleUrls: ['./gig-detail.component.scss']
})
export class GigDetailComponent implements OnInit {
  public configuration: Configuration;
  public gig: Gig;
  public songs: Song[];
  public isPlayMode: boolean;
  public playModeIcon: string = 'play_arrow';

  @ViewChild('songAccordion') songPanels: MatAccordion;

  constructor(
    public configurationService: ConfigurationService,
    private _router: Router,
    private _gigService: GigService,
    private _location: Location,
    private _songService: SongService,
    private _navbarActionService: NavbarActionService
  ) {
    this.registerNavbarActions();
    this.isPlayMode = false;
  }

  ngOnInit() {
    this.gig = this._gigService.retrieveSelectedGig();
    if (!this.gig) {
      this._router.navigate(['/gigs']);
    }
  }

  public drop(event: CdkDragDrop<Song>) {
    moveItemInArray(this.gig.songs, event.previousIndex, event.currentIndex);
  }

  public editSelectedSong(id: string): void {
    this._router.navigate(['/songs/edit', id]);
  }

  public togglePlayMode(): void {
    this.isPlayMode = !this.isPlayMode;
    if (this.isPlayMode) {
      this.songPanels.openAll();
      this.playModeIcon = 'pause';
    } else {
      this.songPanels.closeAll();
      this.playModeIcon = 'play_arrow';
    }
    this.registerNavbarActions();
  }

  private registerNavbarActions(): void {
    if (this.isPlayMode) {
      this._navbarActionService.registerActions([
        {
          order: 100,
          icon: this.playModeIcon,
          action: () => {
            this.togglePlayMode();
          }
        }
      ]);
    } else {
      this._navbarActionService.registerActions([
        {
          order: 100,
          icon: 'save',
          action: () => {
            this._gigService.saveGig(this.gig);
          }
        },
        {
          order: 200,
          icon: this.playModeIcon,
          action: () => {
            this.togglePlayMode();
          }
        },
        {
          order: 300,
          icon: 'edit',
          action: () => {
            this._router.navigate(['./gigs/edit', this.gig.id]);
          }
        }
      ]);
    }
  }
}
