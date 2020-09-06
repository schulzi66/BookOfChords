import { Component, OnInit } from '@angular/core';
import { TitleKeyService, TITLEKEYS } from '../services/title-key.service';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 700 })]
})
export class DemoComponent {
  constructor() {}
}
