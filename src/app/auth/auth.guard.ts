import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'app/auth/login/login.component';

import { User } from 'firebase/auth';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, tap } from 'rxjs/operators';

import { Auth } from 'app/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: Auth, private dialog: MatDialog) {}

    canActivate() {
      return this.auth.userChanges.pipe(
        switchMap(user => user ? Observable.of(true) : this.login())
      );
    }

    login() {
      return this.dialog.open(LoginComponent).afterClosed().pipe(map(value => !!value));
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