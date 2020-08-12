import { Component, OnInit } from '@angular/core';
import { TitleService, TITLEKEYS } from '../services/title.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  constructor(private _titleService: TitleService) {}

  ngOnInit() {
    this._titleService.currentTitleKey = TITLEKEYS.demo;
  }
}
