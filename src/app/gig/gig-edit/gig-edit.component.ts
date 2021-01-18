import { SnackbarService } from './../../services/snackbar.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Router, ActivatedRoute } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { PopupDialogData } from 'src/app/shared/components/popup-dialog/popup-dialog-data';
import { PopupDialogComponent } from 'src/app/shared/components/popup-dialog/popup-dialog.component';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { User } from '../../models/user';
import { SongService } from '../../songs/services/song.service';
import { GigService } from '../services/gig.service';
import { AuthService } from './../../services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { INavbarAction } from 'src/app/models/navbar-action';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
  selector: 'app-gig-edit',
  templateUrl: './gig-edit.component.html',
  styleUrls: ['./gig-edit.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class GigEditComponent extends SubscriptionHandler implements OnInit {
  public gig: Gig;
  public allSongs: Song[];
  public selectedSongs: Song[];
  public filteredSongs: Song[];
  public filterToggle: boolean = false;
  public filterIcon: string = 'search';
  public isNewGig: boolean = false;

  public get isValidGig(): boolean {
    return this.gig.name && this.gig.songs.length > 0 && this._currentUser !== undefined;
  }

  @ViewChild(MatSelectionList) selection: MatSelectionList;

  private _currentUser: User;
  private _popupDialogData: PopupDialogData;

  constructor(
    private _gigService: GigService,
    private _songService: SongService,
    private _authService: AuthService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _navbarActionService: NavbarActionService,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackbarService
  ) {
    super();
    this.gig = this._activatedRoute.snapshot.data['gig'];
    if (this.gig === null || this.gig === undefined) {
      this.isNewGig = true;
      this.gig = new Gig('New Gig');
    }

    this.registerNavbarActions();
  }

  ngOnInit() {
    this._currentUser = this._authService.user;
    this._subscriptions$.add(
      this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
        this.allSongs = songs;
        this.filteredSongs = songs;
      })
    );
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
      this._gigService.saveGig(this.gig).then(() => {
        this._snackbarService.show({
          message: translate<string>('saved')
        });
      });
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
    const saveAction: INavbarAction = {
      order: 100,
      icon: 'save',
      action: () => {
        this.saveGig();
      }
    };
    const deleteAction: INavbarAction = {
      order: 200,
      icon: 'delete',
      action: () => {
        this.deleteGig();
      }
    };
    const filterAction: INavbarAction = {
      order: 300,
      icon: this.filterIcon,
      action: () => {
        this.toggleFilter();
      }
    };

    this._navbarActionService.registerActions([saveAction, ...(this.isNewGig ? [] : [deleteAction]), filterAction]);
  }
}
