import { FormControl, NgModel } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { GigService } from '../services/gig.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { translate } from '@ngneat/transloco';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-gig-detail',
  templateUrl: './gig-detail.component.html',
  styleUrls: ['./gig-detail.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigDetailComponent implements OnInit {
  public configuration: Configuration;
  public gig: Gig;
  public songs: Song[];
  public isPlayMode: boolean;
  public playModeIcon: string = 'play_arrow';
  private _currentSongIndexPlayed: number;

  @ViewChild('songAccordion') songPanels: MatAccordion;
  @ViewChild('gigNameModel') gigNameModel: NgModel;

  constructor(
    public configurationService: ConfigurationService,
    private _router: Router,
    private _gigService: GigService,
    private _navbarActionService: NavbarActionService,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackbarService
  ) {
    this.registerNavbarActions();
    this.isPlayMode = false;
  }

  ngOnInit() {
    this.gig = this._activatedRoute.snapshot.data['gig'];
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

  public onStartPlaySong(index: number): void {
    this._currentSongIndexPlayed = index;
  }

  public onStopPlaySong(): void {
      this._currentSongIndexPlayed = undefined;
  }

  public showPlay(index: number): boolean {
    if (this._currentSongIndexPlayed === undefined) {
      return true;
    } else {
      return this._currentSongIndexPlayed === index;
    }
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
            this._gigService.saveGig(this.gig).then(() => {
              this._snackbarService.show({
                message: translate<string>('saved')
              });
            });
          },
          validator: () => this.gigNameModel && this.gigNameModel.valid
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
