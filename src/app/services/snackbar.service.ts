import { RockNRollSnackbarComponent } from 'src/app/shared/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { RockNRollSnackbarConfigInjectionToken } from './../shared/components/rock-n-roll-snackbar/rock-n-roll-snackbar.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  public constructor(private _snackBar: MatSnackBar) {}

  public show(token: RockNRollSnackbarConfigInjectionToken): MatSnackBarRef<RockNRollSnackbarComponent> {
    return this._snackBar.openFromComponent(RockNRollSnackbarComponent, { data: token });
  }
}
