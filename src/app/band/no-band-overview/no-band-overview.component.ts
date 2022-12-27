import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { BandCreateComponent } from '../band-create/band-create.component';
import { BandJoinComponent } from '../band-join/band-join.component';

@Component({
    selector: 'app-no-band-overview',
    standalone: true,
    imports: [BandCreateComponent, BandJoinComponent, MatTabsModule, TranslocoModule],
    templateUrl: './no-band-overview.component.html',
    styleUrls: ['./no-band-overview.component.scss'],
    animations: [fadeInOnEnterAnimation({ duration: 700 })],
})
export class NoBandOverviewComponent {}
