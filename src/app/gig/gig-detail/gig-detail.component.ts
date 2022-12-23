import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Configuration } from 'src/app/models/configuration';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MetronomeComponent } from 'src/app/shared/components/metronome/metronome.component';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { EncodeUriPipe } from '../../shared/pipes/encode.pipe';
import { GigService } from '../services/gig.service';
import { PinchZoomComponent } from './../../shared/components/pinch-zoom/pinch-zoom.component';

@Component({
  selector: 'app-gig-detail',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    EncodeUriPipe,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MetronomeComponent,
    PdfJsViewerModule,
    PinchZoomComponent,
    TranslocoModule,
  ],
  templateUrl: './gig-detail.component.html',
  styleUrls: ['./gig-detail.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigDetailComponent implements OnInit {
  public configuration: Configuration;
  public gig: Gig;
  public songs: Song[];
  public isPlayMode: boolean;
  public isDragMode: boolean;
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
    this.isDragMode = false;
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
        },
        {
          order: 400,
          icon: 'drag_handle',
          action: () => (this.isDragMode = !this.isDragMode)
        }
      ]);
    }
  }
}
