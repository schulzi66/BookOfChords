import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private _searchString: string;

  public get searchString(): string {
    return this._searchString;
  }

  public set searchString(v: string) {
    this._searchString = v;
  }

  constructor() {}
}
