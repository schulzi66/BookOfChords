import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { User } from 'src/app/models/user';
import { catchError, take, map, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  constructor(private _authService: AuthService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {

     return this._authService.user$.pipe();
  }
}
