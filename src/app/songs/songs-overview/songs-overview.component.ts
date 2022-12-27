import { Configuration } from 'src/app/models/configuration';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { take } from 'rxjs/operators';
import { BandService } from 'src/app/band/services/band.service';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Band } from 'src/app/models/band';
import { AuthService } from 'src/app/services/auth.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { Song } from '../../models/song';
import { SubscriptionHandler } from '../../shared/helper/subscription-handler';
import { SongService } from '../services/song.service';
import { NgClass } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-songs-overview',
    standalone: true,
    imports: [SearchComponent, MatListModule, ScrollingModule, RouterLink, NgClass],
    templateUrl: './songs-overview.component.html',
    styleUrls: ['./songs-overview.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class SongsOverviewComponent extends SubscriptionHandler implements OnInit {
    public filteredSongs: Song[];

    private _selectedBand: Band;
    private _songs: Song[];

    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    constructor(
        public _songService: SongService,
        private _router: Router,
        private _navbarActionService: NavbarActionService,
        private _bottomSheetService: BottomSheetService,
        private _bandService: BandService,
        private _authService: AuthService,
        private _configurationService: ConfigurationService,
    ) {
        super();
        this._navbarActionService.registerActions([
            {
                order: 100,
                icon: 'add',
                action: () => this.createNewSong(),
            },
            {
                order: 200,
                icon: 'group',
                action: () => this.selectBand(),
                validator: () => this._authService.user?.bandIds?.length > 0,
            },
            {
                order: 300,
                icon: 'filter_alt',
                action: () => this.filterAndStoreArchivedSongs(true),
                validator: () => !this._songService.filterArchivedSongs,
            },
            {
                order: 301,
                icon: 'filter_alt_off',
                action: () => this.filterAndStoreArchivedSongs(false),
                validator: () => this._songService.filterArchivedSongs,
            },
            {
                order: 400,
                icon: 'casino',
                action: () => this.chooseRandomSong(),
            },
        ]);
    }

    ngOnInit() {
        if (this._songService.selectedBandForOverview) {
            this._selectedBand = this._songService.selectedBandForOverview;
            this._subscriptions$.add(
                this._songService
                    .getSongsForUserByBandId(this._authService.user.uid, this._selectedBand.id)
                    .pipe(take(1))
                    .subscribe((songs: Song[]) => {
                        this._songs = songs;
                        this.filteredSongs = songs;
                        this.loadConfigAndFilterArchivedSongs();
                    }),
            );
        } else {
            this._subscriptions$.add(
                this._songService.songs$.subscribe((songs: Song[]) => {
                    this._songs = songs;
                    this.filteredSongs = songs;
                    this.loadConfigAndFilterArchivedSongs();
                }),
            );
        }
    }

    public createNewSong(): void {
        this._router.navigate(['./songs/edit', -1]);
    }

    public filterAndStoreArchivedSongs(filterActive: boolean): void {
        this.storeFilterActiveConfig(filterActive);
        this.filterArchivedSongs(filterActive);
    }

    private loadConfigAndFilterArchivedSongs(): void {
        this._subscriptions$.add(
            this._configurationService.configuration$.subscribe((configuration: Configuration) => {
                this._songService.filterArchivedSongs = configuration.filterArchivedSongsInitially;

                this.filterArchivedSongs(configuration.filterArchivedSongsInitially);
            }),
        );
    }

    private storeFilterActiveConfig(filterActive: boolean): void {
        this._songService.filterArchivedSongs = filterActive;
        this._configurationService.configuration.filterArchivedSongsInitially = filterActive;

        this._configurationService.saveConfigurationForUser(this._configurationService.configuration);
    }

    private filterArchivedSongs(filterActive: boolean): void {
        if (filterActive) {
            this.filteredSongs = this._songs.filter(song => !song.isArchived);
        } else {
            this.filteredSongs = this._songs;
        }
    }

    public searchForSong(searchString: string): void {
        this.filteredSongs = this._songs.filter(song => song.name.toLowerCase().includes(searchString.toLowerCase()));
    }

    public clearSearch(): void {
        this.filterArchivedSongs(this._songService.filterArchivedSongs);
    }

    public chooseRandomSong(): void {
        if (this._songs.length > 0) {
            this._router.navigate(['/songs/details', this._songs[Math.floor(Math.random() * this._songs.length)].id]);
        }
    }

    public selectBand(): void {
        const bottomSheetRef: MatBottomSheetRef = this._bottomSheetService.showBandSelection({
            bands: this._bandService.bandsSubject.value,
            onSelectionCallback: (band: Band) => {
                this._selectedBand = band;
                this._songService.selectedBandForOverview = band;
                this._songService
                    .getSongsForUserByBandId(this._authService.user.uid, band.id)
                    .pipe(take(1))
                    .subscribe((songs: Song[]) => {
                        this._songs = songs;
                        this.filteredSongs = songs;
                    });
                bottomSheetRef.dismiss();
            },
        });
    }
}
