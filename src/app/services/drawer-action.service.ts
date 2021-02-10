import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, NavigationStart } from '@angular/router';

export const DEFAULT_DRAWER_ICON_KEY: string = 'menu';

@Injectable({ providedIn: 'root' })
export class DrawerActionService {
  public get iconKey(): string {
    return this._iconKey;
  }
  public set iconKey(v: string) {
    this._iconKey = v;
  }
  public set drawer(v: MatDrawer) {
    this._drawer = v;
  }

  public set drawerAction(v: () => void) {
    this._drawerAction = v;
  }

  constructor(private _router: Router) {
    this._router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        this._drawerAction = undefined;
        this.iconKey = DEFAULT_DRAWER_ICON_KEY;
      }
    });
    this._iconKey = DEFAULT_DRAWER_ICON_KEY;
  }
  private _iconKey: string;

  private _drawer: MatDrawer;

  private _drawerAction: () => void;

  public executeAction(): void {
    if (this._drawerAction) {
      this._drawerAction();
      this.resetDrawerAction();
    } else {
      this._drawer.toggle();
    }
  }

  public resetDrawerAction(): void {
    this.drawerAction = undefined;
  }
}
