import { TitleService, TITLEKEYS } from './../services/title.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, private _titleService: TitleService) {}

  ngOnInit(): void {
    this._titleService.currentTitleKey = TITLEKEYS.default;
  }
}
