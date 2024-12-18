import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { INavbarAction } from 'src/app/models/navbar-action';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { StatsService } from 'src/app/services/stats.service';
import { DeletePopupDialogData } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog-data';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { Gig } from '../../models/gig';
import { Song } from '../../models/song';
import { User } from '../../models/user';
import { SongService } from '../../songs/services/song.service';
import { GigService } from '../services/gig.service';
import { AuthService } from './../../services/auth.service';
import { SnackbarService } from './../../services/snackbar.service';

@Component({
    selector: 'app-gig-edit',
    standalone: true,
    imports: [
        MatListModule,
        CommonModule,
        SearchComponent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        TranslocoModule,
        ScrollingModule,
    ],
    templateUrl: './gig-edit.component.html',
    styleUrls: ['./gig-edit.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class GigEditComponent extends SubscriptionHandler implements OnInit {
    public gig: Gig;
    public allSongs: Song[];
    public selectedSongs: Song[];
    public filteredSongs: Song[];
    public filterToggle: boolean = false;
    public filterIcon: string = 'search';
    public isNewGig: boolean = false;

    @ViewChild('gigNameModel') gigNameModel: NgModel;

    public get isValidGig(): boolean {
        return this.gig.name && this.gig.songs.length > 0 && this._currentUser !== undefined;
    }

    @ViewChild(MatSelectionList) selection: MatSelectionList;

    private _currentUser: User;
    private _popupDialogData: DeletePopupDialogData;

    constructor(
        private _gigService: GigService,
        private _songService: SongService,
        private _authService: AuthService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _navbarActionService: NavbarActionService,
        private _activatedRoute: ActivatedRoute,
        private _snackbarService: SnackbarService,
        private _statsService: StatsService,
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
        this._statsService.saveStats({
            uid: this._authService.user.uid,
            userName: this._authService.user.displayName,
            date: new Date(),
            path: `gig-edit-${this.isNewGig ? 'new-gig' : 'existing-gig'}`,
        });
        this._currentUser = this._authService.user;
        this._subscriptions$.add(this._authService.user$.subscribe((user: User) => (this._currentUser = user)));
        this._subscriptions$.add(
            this._songService.getSongsForUser(this._currentUser.uid).subscribe((songs: Song[]) => {
                this.allSongs = songs;
                this.filteredSongs = songs;
            }),
        );
    }

    public checkSelected(song: Song): boolean {
        return this.gig.songs.find(x => x.id === song.id) !== undefined;
    }

    public onSelectionChange(event: MatSelectionListChange): void {
        // song was added
        if (event.options[0].selected) {
            this.gig.songs.push(event.options[0].value as Song);
        } else {
            // song was removed
            this.gig.songs.splice(
                this.gig.songs.findIndex(x => x.id === event.options[0].value.id),
                1,
            );
        }
    }

    public saveGig(): void {
        if (this.isValidGig) {
            this.gig.uid = this._currentUser.uid;
            this._gigService.saveGig(this.gig).then(() => {
                this._snackbarService.show({
                    message: translate<string>('saved'),
                });
            });
        }
    }

    public searchForSong(searchString: string): void {
        this.filteredSongs = this.allSongs.filter(song => song.name.toLowerCase().includes(searchString.toLowerCase()));
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
            content: translate<string>('delete_gig_content', { value: this.gig.name }),
        };
        const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
            data: this._popupDialogData,
        });

        this._subscriptions$.add(
            dialogRef.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                    this._gigService.deleteGig(this.gig.id).then(() => {
                        this._router.navigate(['/gigs']);
                    });
                }
            }),
        );
    }

    private registerNavbarActions(): void {
        const saveAction: INavbarAction = {
            order: 100,
            icon: 'save',
            action: () => {
                this.saveGig();
            },
            validator: () => this.gigNameModel && this.gigNameModel.valid,
        };
        const deleteAction: INavbarAction = {
            order: 200,
            icon: 'delete',
            action: () => {
                this.deleteGig();
            },
        };
        const filterAction: INavbarAction = {
            order: 300,
            icon: this.filterIcon,
            action: () => {
                this.toggleFilter();
            },
        };

        this._navbarActionService.registerActions([saveAction, ...(this.isNewGig ? [] : [deleteAction]), filterAction]);
    }
}
