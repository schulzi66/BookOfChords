import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { Gig } from 'src/app/models/gig';
import { MediaTypes } from 'src/app/models/media-types.enum';
import { Setlist } from 'src/app/models/setlist';
import { Song } from 'src/app/models/song';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { SongService } from 'src/app/songs/services/song.service';
import { BandService } from '../services/band.service';
import { GigService } from './../../gig/services/gig.service';
import { SnackbarService } from './../../services/snackbar.service';

@Component({
  selector: 'app-band-setlist-edit',
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

  public constructor(
    public configurationService: ConfigurationService,
    private _activatedRoute: ActivatedRoute,
    private _bandService: BandService,
    private _authService: AuthService,
    private _location: Location,
    private _songService: SongService,
    private _gigService: GigService,
    private _snackbarService: SnackbarService,
    private _navbarActionService: NavbarActionService,
    private _bottomSheetService: BottomSheetService
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
      }
    ]);
  }

  ngOnInit() {
    this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
    this._subscriptions$.add(
      this._activatedRoute.params.subscribe((params: { id?: string }) => {
        if (this._bandService.selectedBand !== undefined) {
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
    if (event.option.selected) {
      this.setlist.songs.push((event.option.value as Song).name);
    } else {
      this.setlist.songs.splice(
        this.setlist.songs.findIndex((x) => x === (event.option.value as Song).name),
        1
      );
    }
    this.saveIfValid();
  }

  public exportSetlistAsGig(): void {
    const gig = new Gig(this.setlist.name);
    gig.uid = this._currentUser.uid;

    this.setlist.songs.forEach((setlistSong) => {
      const song = this.allSongsOfCurrentUser.find(
        (x) => x.name.toLowerCase().trim() === setlistSong.toLowerCase().trim()
      );
      if (song) {
        // User has already this song in his book of chords and song should be added to new gig
        gig.songs.push(song);
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
