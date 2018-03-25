import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { User } from '@firebase/auth-types';

import { LoginComponent, LoginCredentials } from 'app/auth/login/login.component';
import { Destroyable } from 'app/destroyable';

import { Observable } from 'rxjs/Observable';
import { first, switchMap, takeUntil } from 'rxjs/operators';

export interface UserInfo {
  roles: { [role: string]: boolean };
}

@Injectable()
export class Auth extends Destroyable {
  user: User;
  userInfo: UserInfo;
  userChanges = this.afAuth.authState.pipe(this.takeUntilDestroyed());
  userInfoChanges = this.userChanges.pipe(switchMap(user => this.getUserInfo(user)));

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super();
    this.userChanges.pipe(this.takeUntilDestroyed()).subscribe(user => this.user = user);
    this.userInfoChanges.pipe(this.takeUntilDestroyed()).subscribe(userInfo => this.userInfo = userInfo);
  }

  login(message: string) {
    return this.userChanges.pipe(
      first(),
      switchMap(user => user ? Observable.of(user) : this.showLogin(message))
    ).toPromise();
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }

  private showLogin(message?: string) {
    const dialog = this.dialog.open(LoginComponent, { autoFocus: false });
    const component = dialog.componentInstance;
    component.message = message;

    const loginObserver = {
      next(result) { dialog.close(result); },
      error(error) { dialog.componentInstance.error = error; }
    };

    dialog.componentInstance.googleLogin.pipe(
      switchMap(() => this.doGoogleLogin()),
      takeUntil(dialog.afterClosed())
    ).subscribe(loginObserver);

    dialog.componentInstance.emailLogin.pipe(
      switchMap(credentials => this.doEmailLogin(credentials)),
      takeUntil(dialog.afterClosed())
    ).subscribe(loginObserver);

    return dialog.afterClosed();
  }

  private handleGoogleLoginRequest(dialog) {}

  private doGoogleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  private doEmailLogin(credentials: LoginCredentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  private getUserInfo(user: User): Observable<UserInfo|null> {
    if (user) {
      return this.firestore.doc<UserInfo>(`users/${user.uid}`)
        .valueChanges()
        .pipe(this.takeUntilDestroyed());
    } else {
      return Observable.of(null);
    }
  }
}
