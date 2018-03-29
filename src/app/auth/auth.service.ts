import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { User } from '@firebase/auth-types';

import { LoginComponent, LoginCredentials } from 'app/auth/login/login.component';
import { Destroyable } from 'app/destroyable';

import { Observable } from 'rxjs/Observable';
import { first, switchMap, takeUntil, shareReplay } from 'rxjs/operators';


@Injectable()
export class Auth extends Destroyable {
  user: User;
  userChanges = this.afAuth.authState.pipe(
    this.takeUntilDestroyed(),
    shareReplay(1)
  );

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private dialog: MatDialog,
  ) {
    super();
    this.userChanges.pipe(this.takeUntilDestroyed()).subscribe(user => {
      this.user = user;
    });
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

  private doGoogleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  private async doEmailLogin(credentials: LoginCredentials) {
    await this.afAuth.auth.setPersistence(credentials.rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION);
    return await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
}
