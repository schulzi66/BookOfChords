import { TitleKeyService, TITLEKEYS } from '../services/title-key.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(public authService: AuthService, private _titleService: TitleKeyService) {
    this._titleService.currentTitleKey = TITLEKEYS.default;
  }
}
