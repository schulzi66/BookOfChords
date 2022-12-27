import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Gig } from 'src/app/models/gig';
import { GigService } from './../../gig/services/gig.service';

@Injectable({ providedIn: 'root' })
export class GigResolver implements Resolve<Gig> {
    constructor(private _gigService: GigService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Gig> | Promise<Gig> | Gig {
        return this._gigService.gigs$.pipe(map(gigs => gigs.find(gig => gig.id === route.params['id']))).pipe(first());
    }
}
