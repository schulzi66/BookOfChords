import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { PopupDialogData } from 'src/app/shared/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared/components/popup-dialog/popup-dialog.component';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { User } from '../../models/user';
import { SongService } from '../../songs/services/song.service';
import { GigService } from '../services/gig.service';
import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-gig-edit',
  templateUrl: './gig-edit.component.html',
  styleUrls: ['./gig-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigEditComponent implements OnInit, OnDestroy {
  public gig: Gig;
  public allSongs: Song[];
  public selectedSongs: Song[];
  public filteredSongs: Song[];
  public filterToggle: boolean = false;
  public filterIcon: string = 'search';
  public isNewGig: boolean;

  public get isValidGig(): boolean {
    return this.gig.name && this.gig.songs.length > 0 && this._currentUser !== undefined;
  }

  @ViewChild(MatSelectionList) selection: MatSelectionList;

  private _currentUser: User;
  private _popupDialogData: PopupDialogData;
  private _subscriptions$: Subscription;

  constructor(
    private _gigService: GigService,
    private _songService: SongService,
    private _authService: AuthService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _navbarActionService: NavbarActionService
  ) {
    this.registerNavbarActions();
    this._subscriptions$ = new Subscription();
  }

  ngOnInit() {
    this.gig = this._gigService.retrieveSelectedGig();
    if (this.gig === null || this.gig === undefined) {
      this.isNewGig = true;
    }
    if (!this.gig) {
      this.gig = new Gig('New Gig');
    }

    this._currentUser = this._authService.user;
    this._subscriptions$.add(
      this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
        this.allSongs = songs;
        this.filteredSongs = songs;
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  public checkSelected(song: Song): boolean {
    return this.gig.songs.find((x) => x.id === song.id) !== undefined;
  }

  public onSelectionChange(event: MatSelectionListChange): void {
    // song was added
    if (event.option.selected) {
      this.gig.songs.push(event.option.value as Song);
    } else {
      // song was removed
      this.gig.songs.splice(
        this.gig.songs.findIndex((x) => x.id === event.option.value.id),
        1
      );
    }
  }

  public saveGig(): void {
    if (this.isValidGig) {
      this.gig.uid = this._currentUser.uid;
      this._gigService.saveGig(this.gig);
    }
  }

  public searchForSong(searchString: string): void {
    this.filteredSongs = this.allSongs.filter((song) => song.name.toLowerCase().includes(searchString.toLowerCase()));
  }

  public clearSearch(): void {
    this.filteredSongs = this.allSongs;
  }

  public toggleFilter(): void {
    this.filterToggle ? (this.filterIcon = 'search') : (this.filterIcon = 'text_fields');
    this.filterToggle = !this.filterToggle;
    this.registerNavbarActions();
    this.clearSearch();
  }

  public deleteGig(): void {
    this._popupDialogData = {
      title: translate<string>('delete_gig_title'),
      content: translate<string>('delete_gig_content', { value: this.gig.name })
    };
    const dialogRef = this._matDialog.open(PopupDialogComponent, {
      data: this._popupDialogData
    });

    this._subscriptions$.add(
      dialogRef.afterClosed().subscribe((result: Boolean) => {
        if (result) {
          this._gigService.deleteGig(this.gig.id).then(() => {
            this._router.navigate(['/gigs']);
          });
        }
      })
    );
  }

  private registerNavbarActions(): void {
    this._navbarActionService.registerActions([
      {
        order: 100,
        icon: 'save',
        action: () => {
          this.saveGig();
        }
      },
      {
        order: 200,
        icon: 'delete',
        action: () => {
          this.deleteGig();
        }
      },
      {
        order: 300,
        icon: this.filterIcon,
        action: () => {
          this.toggleFilter();
        }
      }
    ]);
  }
}
