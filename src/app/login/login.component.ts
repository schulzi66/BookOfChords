import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000, delay: 300 })]
})
export class LoginComponent {
  constructor(public authService: AuthService) {}
}
