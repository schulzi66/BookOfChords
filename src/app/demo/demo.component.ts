import { Component, OnInit } from '@angular/core';
import { TitleKeyService, TITLEKEYS } from '../services/title-key.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  constructor(private _titleService: TitleKeyService) {
    this._titleService.currentTitleKey = TITLEKEYS.demo;
  }
}
