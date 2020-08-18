import { Location } from '@angular/common';
import { TitleKeyService } from 'src/app/services/title-key.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleKeyResolver implements Resolve<any> {
  constructor(private _titleKeyService: TitleKeyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this._titleKeyService.currentTitleKey = route.data['key'];
  }
}
