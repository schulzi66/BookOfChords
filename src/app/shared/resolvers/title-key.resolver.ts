import { Location } from '@angular/common';
import { TitleKeyService } from 'src/app/services/title-key.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleKeyResolver implements Resolve<any> {
  constructor(private service: TitleKeyService, private _router: Router, private _location: Location) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    console.log(this._router.url);
  }
}
