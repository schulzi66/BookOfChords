import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';

export class RockNRollSnackbarConfigInjectionToken {
    public message: string;
    public route: string;
}

@Component({
	selector: 'app-rock-n-roll-snackbar',
	templateUrl: './rock-n-roll-snackbar.component.html',
	styleUrls: [ './rock-n-roll-snackbar.component.scss' ]
})
export class RockNRollSnackbarComponent {
    public token: RockNRollSnackbarConfigInjectionToken;

	constructor(@Inject(MAT_SNACK_BAR_DATA) token: RockNRollSnackbarConfigInjectionToken, private _router: Router) {
        this.token = token;
    }
    
    public tryNavigate() {
        this._router.navigate([this.token.route]);
    }
}
