import { Observable, of, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

export enum TITLEKEYS {
  default = 'default_title',
  songs = 'songs',
  gigs = 'gigs',
  band = 'band',
  configuration = 'settings',
  demo = 'demo',
  exercises = 'exercises'
}

@Injectable({
  providedIn: 'root'
})
export class TitleKeyService {
  private _currentTitleKey$: BehaviorSubject<string>;

  public set currentTitleKey(v: string) {
    this._currentTitleKey$.next(v);
  }

  public get currentTitleKey$(): Observable<string> {
    return this._currentTitleKey$.asObservable();
  }

  constructor() {
    this._currentTitleKey$ = new BehaviorSubject(TITLEKEYS.default);
  }
}
