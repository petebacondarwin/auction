import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { tap, map } from 'rxjs/operators';

import { Auth } from 'app/auth/auth.service';
import { Storage } from 'app/storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth) {}

  canActivate() {
    return this.auth.login('You must be logged in to access this page').then(value => !!value);
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private storage: Storage) {}

  canActivate() {
    return this.storage.userInfoChanges.pipe(
      map(userInfo => userInfo && userInfo.roles && userInfo.roles.admin)
    );
  }
}
