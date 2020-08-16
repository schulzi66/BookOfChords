import { SongService } from 'src/app/songs/services/song.service';
import { Location } from '@angular/common';
import { DrawerActionService, DEFAULT_DRAWER_ICON_KEY } from './../../services/drawer-action.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrawerActionResolver implements Resolve<void> {
  constructor(private _drawerActionService: DrawerActionService, private _location: Location) {}

  resolve(route: ActivatedRouteSnapshot): Observable<void> | Promise<void> | void {
    this._drawerActionService.iconKey = 'close';
    this._drawerActionService.drawerAction = () => {
      this._drawerActionService.iconKey = DEFAULT_DRAWER_ICON_KEY;
      this._location.back();
    };
  }
}
