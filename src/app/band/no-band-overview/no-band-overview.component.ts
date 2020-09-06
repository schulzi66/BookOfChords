import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-no-band-overview',
  templateUrl: './no-band-overview.component.html',
  styleUrls: ['./no-band-overview.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class NoBandOverviewComponent {}
