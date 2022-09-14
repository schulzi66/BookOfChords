import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationStart, Router } from '@angular/router';

export const DEFAULT_DRAWER_ICON_KEY: string = 'menu';

@Injectable({ providedIn: 'root' })
export class DrawerActionService {
  private _iconKey: string;
  private _drawer: MatDrawer;
  private _drawerAction: () => void;
  private _preDrawerAction: () => void;
  private _disabled: boolean;

  constructor(private _router: Router) {
    this._router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        this.resetActions();
        this.iconKey = DEFAULT_DRAWER_ICON_KEY;
      }
    });
    this._iconKey = DEFAULT_DRAWER_ICON_KEY;
    this._disabled = false;
  }

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

  public set preDrawerAction(v: () => void) {
    this._preDrawerAction = v;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(v: boolean) {
    this._disabled = v;
  }

  public executeAction(): void {
    if (this._disabled) {
      return;
    }

    if (this._drawerAction) {
      if (this._preDrawerAction) {
        this._preDrawerAction();
      }
      this._drawerAction();
      this.resetActions();
    } else {
      this._drawer.toggle();
    }
  }

  public resetActions(): void {
    this.drawerAction = undefined;
    this.preDrawerAction = undefined;
    this.disabled = false;
  }
}
