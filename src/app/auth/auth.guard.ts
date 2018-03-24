import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { map } from 'rxjs/operators';

import { Auth } from 'app/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth) {}

  canActivate() {
    return this.auth.login('You must be logged in to access this page');
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth) {}

  canActivate() {
    return this.auth.userInfoChanges.pipe(
      map(userInfo => userInfo && userInfo.roles.admin)
    );
  }
}
