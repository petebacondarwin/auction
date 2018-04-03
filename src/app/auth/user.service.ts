import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, switchMap, map, tap, takeUntil, defaultIfEmpty } from 'rxjs/operators';

import { Item, UserInfo, UserBidding } from 'app/models';
import { Storage } from 'app/storage.service';
import { Auth } from 'app/auth/auth.service';
import { User } from 'app/auth/auth.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { UserInfoComponent} from './user-info/user-info.component';
import { pick } from 'app/utils';

@Injectable()
export class UserService {
  userInfoChanges = this.auth.userChanges.pipe(
    switchMap(user => user ? this.storage.getUserInfo(user) : of<UserInfo>(null)),
  );

  constructor(
    private storage: Storage,
    private auth: Auth,
    private dialog: MatDialog) {}

  ensureLoggedIn(message?: string) {
    const stop = new Subject();
    let dialog: MatDialogRef<LoginComponent>;

    return this.userInfoChanges.pipe(
      tap(userInfo => {
        if (userInfo) {
          return userInfo;
        } else {
          dialog = this.showLogin(message);
          dialog.afterClosed().subscribe(stop);
        }
      }),
      first(userInfo => !!userInfo),
      tap(userInfo => dialog && dialog.close()),
      takeUntil(stop),
      defaultIfEmpty<UserInfo>(null),
      switchMap(userInfo => userInfo.initialized ? of(userInfo) : this.initUserInfo(userInfo))
    );
  }

  logout() {
    this.auth.logout();
  }

  async updateUserInfo(user: User, userInfo: any) {
    await user.updateProfile({ displayName: userInfo.displayName } as any);
    return await this.storage.updateDoc('users', user.uid, pick(userInfo, ['phone', 'childDetails', 'notify', 'initialized']));
  }

  private initUserInfo(userInfo: UserInfo) {
    const data = { data: { userInfo, message: 'Please provide some additional information.' } };
    const dialog: MatDialogRef<UserInfoComponent, UserInfo> = this.dialog.open(UserInfoComponent, data);
    return dialog.afterClosed().pipe(
      switchMap(result => {
        if (result) {
          result = { ...result, initialized: true };
          userInfo = { ...userInfo, ...result };
          return this.updateUserInfo(userInfo.user, result).then(() => userInfo);
        }
        return of(userInfo);
      })
    );
  }

  private showLogin(message?: string): MatDialogRef<LoginComponent> {
    return this.dialog.open(LoginComponent, { autoFocus: false, data: message });
  }
}

