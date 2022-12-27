import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { INavbarAction } from './../models/navbar-action';

@Injectable({ providedIn: 'root' })
export class NavbarActionService {
    private _actions: INavbarAction[];

    public get navbarActions$(): Observable<INavbarAction[]> {
        return of(this._actions.sort((a, b) => a.order - b.order).filter(x => x.validator === undefined || x.validator()));
    }

    constructor(private _router: Router) {
        this._actions = [];
        this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(event => {
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
