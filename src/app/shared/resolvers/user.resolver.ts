import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  public constructor(private _authService: AuthService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
    return this._authService.user !== undefined ? this._authService.user : this._authService.user$.pipe(take(1));
  }
}
