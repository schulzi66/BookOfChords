import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarActionService } from 'src/app/services/navbar-action.service';
import { SubscriptionHandler } from 'src/app/shared/helper/subscription-handler';

@Component({
    selector: 'app-band-setlist-overview',
    standalone: true,
    imports: [MatDividerModule, RouterModule, ScrollingModule, MatListModule],
    templateUrl: './band-setlist-overview.component.html',
    styleUrls: ['./band-setlist-overview.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class BandSetlistOverviewComponent extends SubscriptionHandler implements OnInit {
    public band: Band;

    public constructor(
        private _authService: AuthService,
        private _bandService: BandService,
        private _navbarActionService: NavbarActionService,
        private _router: Router,
    ) {
        super();
        this._navbarActionService.registerActions([
            {
                order: 100,
                icon: 'add',
                action: () => this._router.navigate(['./band/setlist/edit', -1]),
            },
        ]);
    }

    ngOnInit() {
        this.band = this._bandService.selectedBand;
    }
}
