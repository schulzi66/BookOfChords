import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { Gig } from 'src/app/models/gig';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { Setlist } from 'src/app/models/setlist';
import { Song } from 'src/app/models/song';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet.service';
import { DrawerActionService } from 'src/app/services/drawer-action.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { SongService } from 'src/app/songs/services/song.service';
import { BandService } from '../services/band.service';
import { GigService } from './../../gig/services/gig.service';
import { SnackbarService } from './../../services/snackbar.service';
import { EncodeUriPipe } from './../../shared/pipes/encode.pipe';

@Component({
  selector: 'app-band-setlist-edit',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    EncodeUriPipe,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    PdfJsViewerModule,
    SearchComponent,
    TextFieldModule,
    TranslocoModule
  ],
  templateUrl: './band-setlist-edit.component.html',
  styleUrls: ['./band-setlist-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class BandSetlistEditComponent extends SubscriptionHandler implements OnInit {
  private _currentUser: User;

  public band: Band;
  public setlist: Setlist;
  public allSongsOfCurrentUser: Song[];
  public selectedSongs: Song[];
  public filteredSongs: Song[];
  public isDragMode: boolean;

  public constructor(
    public configurationService: ConfigurationService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _bandService: BandService,
    private readonly _authService: AuthService,
    private readonly _location: Location,
    private readonly _songService: SongService,
    private readonly _gigService: GigService,
    private readonly _snackbarService: SnackbarService,
    private readonly _navbarActionService: NavbarActionService,
    private readonly _bottomSheetService: BottomSheetService,
    private readonly _drawerActionService: DrawerActionService
  ) {
    super();
    this.setlist = new Setlist();
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () =>
          this.saveIfValid().then((_: string) => {
            this._snackbarService.show({
              message: translate<string>('saved')
            });
          })
      },
      {
        order: 200,
        icon: 'unarchive',
        action: () => this.exportSetlistAsGig()
      },
      {
        order: 300,
        icon: 'upload_file',
        action: () => {
          const bottomSheetRef: MatBottomSheetRef = this._bottomSheetService.showUpload({
            storageBucketPrefix: 'setlists',
            typesToUpload: [MediaTypes.PDF],
            onUploadCallback: (result) => {
              this.setlist.pdfUrl = result.downloadUrl;
              this.saveIfValid();
              bottomSheetRef.dismiss();
            }
          });
        }
      },
      {
        order: 400,
        icon: 'drag_handle',
        action: () => (this.isDragMode = !this.isDragMode)
      }
    ]);

    this.isDragMode = false;
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
    this._subscriptions$.add(
      this._activatedRoute.params.subscribe((params: { id?: string }) => {
        if (!!this._bandService.selectedBand) {
          this.band = this._bandService.selectedBand;
          if (params.id !== '-1') {
            this.setlist = this.band.setlists.find((x) => x.id === params.id);
          }

          this._subscriptions$.add(
            this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
              this.allSongsOfCurrentUser = songs;
              this.filteredSongs = songs;
            })
          );
        } else {
          this._location.back();
        }
      })
    );
  }

  public onNameChanged(): void {
    this.saveIfValid();
  }

  public onDescriptionChanged(description: string): void {
    this.setlist.description = description;
    this.saveIfValid();
  }

  public searchForSong(searchString: string): void {
    this.filteredSongs = this.allSongsOfCurrentUser.filter((song) =>
      song.name.toLowerCase().includes(searchString.toLowerCase())
    );
  }

  public clearSearch(): void {
    this.filteredSongs = this.allSongsOfCurrentUser;
  }

  public checkSelected(song: Song): boolean {
    if (this.setlist.songs) {
      return this.setlist.songs.find((x) => x === song.name) !== undefined;
    } else {
      return false;
    }
  }

  public onSelectionChange(event: MatSelectionListChange) {
    if (event.options[0].selected) {
      this.setlist.songs.push((event.options[0].value as Song).name);
    } else {
      this.setlist.songs.splice(
        this.setlist.songs.findIndex((x) => x === (event.options[0].value as Song).name),
        1
      );
    }
    this.saveIfValid();
  }

  public exportSetlistAsGig(): void {
    this._drawerActionService.disabled = true;

    const gig = new Gig(this.setlist.name);
    gig.uid = this._currentUser.uid;

    this.setlist.songs.forEach((setlistSong) => {
      let songMatches: Song[] = [];

      // Find correct song if user has it multiple time for different bands
      this.allSongsOfCurrentUser.forEach((song: Song) => {
        if (song.name.toLocaleLowerCase().trim() === setlistSong.toLowerCase().trim()) {
          songMatches.push(song);
        }
      });

      let songToTake: Song | undefined = undefined;

      if (songMatches.length > 1) {
        songToTake = songMatches.find((s: Song) => s.bandId === this.band.id);

        if (!songToTake) {
          songToTake = songMatches[0];
        }
      } else {
        songToTake = songMatches[0];
      }

      if (songToTake) {
        // User has already this song in his book of chords and song should be added to new gig
        gig.songs.push(songToTake);
      } else {
        // New song will be created and added to the gig without chords
        const newSong = new Song(setlistSong);
        newSong.uid = this._currentUser.uid;
        gig.songs.push(newSong);
        this._songService.saveSong(newSong);
      }
    });

    this._gigService.saveGig(gig).then(() => {
      this._snackbarService.show({
        message: translate<string>('new_gig_from_setlist'),
        route: 'gigs'
      });
      this._drawerActionService.disabled = false;
    });
  }

  public drop(event: CdkDragDrop<Song>) {
    moveItemInArray(this.setlist.songs, event.previousIndex, event.currentIndex);
    this.saveIfValid();
  }

  private saveIfValid(): Promise<string> {
    if (this.setlist.name) {
      return this._bandService.saveSetlistForBand(this.band, this.setlist);
    }
  }
}
