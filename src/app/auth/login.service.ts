import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs/Observable';
import { first, switchMap, takeUntil, shareReplay } from 'rxjs/operators';

import { Auth, User } from './auth.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component';


@Injectable()
export class Login {

  constructor(private auth: Auth, private dialog: MatDialog) {}

  login(message: string) {
    return this.auth.userChanges.pipe(
      first(),
      switchMap(user => user ? Observable.of(user) : this.showLogin(message))
    ).toPromise();
  }

  private showLogin(message?: string) {
    const dialog: MatDialogRef<LoginComponent, User> = this.dialog.open(LoginComponent, { autoFocus: false });
    const component = dialog.componentInstance;
    component.message = message;

    const loginObserver = {
      next(result) { dialog.close(result); },
      error(error) { dialog.componentInstance.error = error; }
    };

    component.googleLogin.pipe(
      switchMap(() => this.auth.doGoogleLogin()),
      takeUntil(dialog.afterClosed())
    ).subscribe(loginObserver);

    component.emailLogin.pipe(
      switchMap(credentials => this.auth.doEmailLogin(credentials)),
      takeUntil(dialog.afterClosed())
    ).subscribe(loginObserver);

    component.signup.pipe(
      switchMap(() => this.showSignup()),
      takeUntil(dialog.afterClosed())
    ).subscribe(loginObserver);

    return dialog.afterClosed();
  }

  private showSignup() {
    const dialog = this.dialog.open(SignupComponent);

    const component = dialog.componentInstance;

    component.signUp.pipe(
      switchMap(userInfo => this.auth.doSignup(userInfo)),
      takeUntil(dialog.afterClosed())
    ).subscribe(result => dialog.close(result), error => dialog.componentInstance.error = error);

    return dialog.afterClosed();
  }

}
