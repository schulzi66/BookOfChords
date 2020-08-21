import { INavbarAction } from './../models/navbar-action';
import { Router, NavigationStart } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavbarActionService {
  private _actions: INavbarAction[];

  public get navbarActions$(): Observable<INavbarAction[]> {
    return of(this._actions.sort((a, b) => a.order - b.order));
  }

  constructor(private _router: Router) {
    this._actions = [];
    this._router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event) => {
      this._actions = [];
    });
  }

  public registerActions(actions: INavbarAction[]): number {
    this._actions = [];
    return this._actions.push(...actions);
  }
}
