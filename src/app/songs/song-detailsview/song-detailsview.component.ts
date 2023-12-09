import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { translate } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { ConfigurationService } from 'src/app/configuration/services/configuration.service';
import { Song } from 'src/app/models/song';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { DeletePopupDialogComponent } from 'src/app/shared/components/delete-popup-dialog/delete-popup-dialog.component';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';
import { EncodeUriPipe } from '../../shared/pipes/encode.pipe';
import { SnackbarService } from './../../services/snackbar.service';
import { MetronomeComponent } from './../../shared/components/metronome/metronome.component';
import { PinchZoomComponent } from './../../shared/components/pinch-zoom/pinch-zoom.component';
import { SongService } from './../services/song.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-song-detailsview',
    standalone: true,
    imports: [
        ClipboardModule,
        CommonModule,
        EncodeUriPipe,
        MatCardModule,
        MatDividerModule,
        MetronomeComponent,
        PdfJsViewerModule,
        PinchZoomComponent,
        ScrollingModule
    ],
    templateUrl: './song-detailsview.component.html',
    styleUrls: ['./song-detailsview.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class SongDetailsviewComponent extends SubscriptionHandler implements OnInit {
    public song: Song;
    public isArchived: boolean = false;

    constructor(
        private _songService: SongService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _navbarActionService: NavbarActionService,
        private _matDialog: MatDialog,
        private _clipboardService: ClipboardService,
        private _snackbarService: SnackbarService,
        private _pdfService: PdfService,
        public configurationService: ConfigurationService,
    ) {
        super();
        this._navbarActionService.registerActions([
            {
                order: 100,
                icon: 'edit',
                action: () => this._router.navigate(['./songs/edit', this.song.id]),
            },
            {
                order: 200,
                icon: 'content_copy',
                action: () => this.copySelectedSong(),
            },
            {
                order: 300,
                icon: 'archive',
                action: () => this.archiveSong(true),
                validator: () => !this.isArchived,
            },
            {
                order: 301,
                icon: 'unarchive',
                action: () => this.archiveSong(false),
                validator: () => this.isArchived,
            },
            {
                order: 400,
                icon: 'delete_outline',
                action: () => this.deleteSong(),
            },
            // {
            //     order: 500,
            //     icon: 'radio',
            //     action: () => this._songService.searchInSpotify(this.song.name),
            // },
            {
                order: 600,
                icon: 'picture_as_pdf',
                action: () => {
                    const content = [
                        { text: `${this.song.name}\n`, style: 'header' },
                        { text: `BPM: ${this.song.bpm}\n` },
                        {
                            ul: [
                                ...this.song.sections.map(x => {
                                    return [x.name, { ul: x.value }]
                                })
                            ]
                        },
                        { text: '\n'}
                    ]

                    this._pdfService.createPdf(this.song.name, content);
                }
            }
        ]);
    }

    ngOnInit() {
        this.song = this._activatedRoute.snapshot.data['song'];
        this.isArchived = this.song.isArchived;
    }

    public copySelectedSong(): void {
        let songContent: string = '';
        songContent += this.song.name + '\n\n';
        this.song.sections.forEach(section => {
            songContent += section.name + '\n';
            section.value.forEach(value => {
                songContent += value + '\n';
            });
            songContent += '\n';
        });
        this._clipboardService.copy(songContent);
        this._snackbarService.show({
            message: translate<string>('snackbar_copied_data'),
        });
    }

    public archiveSong(archive: boolean): void {
        this.song.isArchived = archive;
        this.isArchived = archive;
        this._songService.saveSong(this.song).then(() => {
            this.isArchived
                ? this._snackbarService.show({
                      message: translate<string>('song_archived'),
                  })
                : this._snackbarService.show({
                      message: translate<string>('song_unarchived'),
                  });
        });
    }

    public deleteSong(): void {
        const dialogRef = this._matDialog.open(DeletePopupDialogComponent, {
            data: {
                title: translate<string>('delete_song_title'),
                content: translate<string>('delete_song_content', {
                    value: this.song.name,
                }),
            },
        });

        this._subscriptions$.add(
            dialogRef.afterClosed().subscribe((result: Boolean) => {
                if (result) {
                    this._songService.deleteSong(this.song.id).then(() => {
                        this._router.navigate(['./songs']);
                    });
                }
            }),
        );
    }

    public updateBpm(newBpm: number): void {
        this.song.bpm = newBpm;
    }
}
