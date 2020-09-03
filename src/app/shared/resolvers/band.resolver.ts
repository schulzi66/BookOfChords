import { take } from 'rxjs/operators';
import { BandService } from 'src/app/band/services/band.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Band } from 'src/app/models/band';

@Injectable({ providedIn: 'root' })
export class BandResolver implements Resolve<Band> {
  constructor(private _bandService: BandService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<Band> | Promise<Band> | Band {
    return this._bandService.band !== undefined ? this._bandService.band : this._bandService.band$.pipe(take(1));
  }
}
