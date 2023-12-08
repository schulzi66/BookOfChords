import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BandService } from 'src/app/band/services/band.service';
import { Band } from 'src/app/models/band';

@Injectable({ providedIn: 'root' })
export class BandResolver  {
    constructor(private _bandService: BandService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Band[]> | Promise<Band[]> | Band[] {
        // Not used currently
        return this._bandService.bands !== undefined ? this._bandService.bands : this._bandService.bands$.pipe(take(1));
    }
}
