import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { of } from 'rxjs/observable/of';
import { map, tap, switchMap } from 'rxjs/operators';

import { Login } from 'app/auth/login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private login: Login,
    private router: Router) {}

  canActivate() {
    return this.login.ensureLoggedIn('You must be logged in to access this page').pipe(
      // If still not logged in then redirect home
      tap(user => user || this.router.navigateByUrl('/')),
      map(user => !!user)
    );
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private login: Login,
    private router: Router) {}

  canActivate() {
    return this.login.userInfoChanges.pipe(
      map(userInfo => userInfo && userInfo.roles && userInfo.roles.admin),
      // If not admin then just redirect home
      tap(isAdmin => isAdmin || this.router.navigateByUrl('/')),
    );
  }
}
