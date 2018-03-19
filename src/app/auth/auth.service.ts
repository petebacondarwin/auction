import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { User, GoogleAuthProvider } from '@firebase/auth-types';

import { Destroyable } from 'app/destroyable';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

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
  ) {
    super();

    this.userChanges.subscribe(user => {
      console.log('user', user);
      this.user = user;
    });

    this.userInfoChanges.subscribe(userInfo => {
      console.log('userInfo', userInfo);
      this.userInfo = userInfo;
    });
  }

  loginViaGoogle() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginViaEmail(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }

  private getUserInfo(user: User): Observable<UserInfo|null> {
    console.log('getUserInfo', user && user.email);
    if (user) {
      return this.firestore.doc<UserInfo>(`users/${user.uid}`)
        .valueChanges()
        .pipe(this.takeUntilDestroyed());
    } else {
      return Observable.of(null);
    }
  }
}