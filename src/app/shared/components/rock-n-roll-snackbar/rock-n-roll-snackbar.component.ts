import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface RockNRollSnackbarConfigInjectionToken {
  message: string;
  route?: string;
}

@Component({
  selector: 'app-rock-n-roll-snackbar',
  standalone: true,
  templateUrl: './rock-n-roll-snackbar.component.html',
  styleUrls: ['./rock-n-roll-snackbar.component.scss']
})
export class RockNRollSnackbarComponent {
  public token: RockNRollSnackbarConfigInjectionToken;

  constructor(@Inject(MAT_SNACK_BAR_DATA) token: RockNRollSnackbarConfigInjectionToken, private _router: Router) {
    this.token = token;
  }

  public tryNavigate() {
    if (this.token.route) {
      this._router.navigate([this.token.route]);
    }
  }
}
