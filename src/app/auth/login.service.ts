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

    return dialog.afterClosed();
  }
}
