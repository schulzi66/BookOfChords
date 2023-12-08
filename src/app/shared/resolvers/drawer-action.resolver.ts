import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DEFAULT_DRAWER_ICON_KEY, DrawerActionService } from '../../services/drawer-action.service';

@Injectable({ providedIn: 'root' })
export class DrawerActionResolver  {
    constructor(private _drawerActionService: DrawerActionService, private _location: Location) {}

    resolve(route: ActivatedRouteSnapshot): Observable<void> | Promise<void> | void {
        if (route.data['isBaseDrawerAction']) {
            this._drawerActionService.iconKey = DEFAULT_DRAWER_ICON_KEY;
            this._drawerActionService.resetActions();
        } else {
            this._drawerActionService.iconKey = 'cancel';
            this._drawerActionService.drawerAction = () => {
                this._drawerActionService.iconKey = DEFAULT_DRAWER_ICON_KEY;
                this._location.back();
            };
        }
    }
}
