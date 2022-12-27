import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TitleKeyService } from 'src/app/services/title-key.service';

@Injectable({ providedIn: 'root' })
export class TitleKeyResolver implements Resolve<any> {
    constructor(private _titleKeyService: TitleKeyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this._titleKeyService.currentTitleKey = route.data['key'];
    }
}
