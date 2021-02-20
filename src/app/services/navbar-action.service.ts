import { INavbarAction } from './../models/navbar-action';
import { Router, NavigationStart } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavbarActionService {
  private _actions: INavbarAction[];

  public get navbarActions$(): Observable<INavbarAction[]> {
    return of(this._actions.sort((a, b) => a.order - b.order).filter((x) => x.validator === undefined || x.validator()));
  }

  constructor(private _router: Router) {
    this._actions = [];
    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event) => {
      this.resetActions();
    });
  }

  public registerActions(actions: INavbarAction[]): number {
    this.resetActions();
    return this._actions.push(...actions);
  }

  public resetActions(): void {
    this._actions = [];
  }
}
