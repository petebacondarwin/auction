import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'app/auth/login/login.component';

import { AngularFireAuth } from "angularfire2/auth";
import { User } from 'firebase/auth';

import { Observable } from 'rxjs/Observable';
import { first, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private afAuth: AngularFireAuth, private dialog: MatDialog) {}

    canActivate() {
      return this.afAuth.authState.pipe(
        switchMap(user => this.checkAuth(user))
      );
    }

    checkAuth(user: User) {
      return user ? Observable.of(true) : this.login();
    }

    login(): Observable<boolean> {
      return this.dialog.open(LoginComponent).afterClosed().pipe(map(value => !!value));
    }

}