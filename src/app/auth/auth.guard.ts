import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { map } from 'rxjs/operators';

import { Login } from 'app/auth/login.service';
import { Storage } from 'app/storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private login: Login) {}

  canActivate() {
    return this.login.login('You must be logged in to access this page').then(value => !!value);
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private storage: Storage) {}

  canActivate() {
    return this.storage.userInfoChanges.pipe(
      map(userInfo => userInfo && userInfo.roles && userInfo.roles.admin)
    );
  }
}
