import { Injectable } from '@angular/core';

export enum TITLEKEYS {
  default = 'default_title',
  songs = 'songs',
  gigs = 'gigs',
  band = 'band',
  configuration = 'settings',
  demo = 'demo'
}

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private _currentTitleKey: string;
  public get currentTitleKey(): string {
    return this._currentTitleKey;
  }
  public set currentTitleKey(v: string) {
    this._currentTitleKey = v;
  }

  constructor() {
    this.currentTitleKey = TITLEKEYS.default;
  }
}
