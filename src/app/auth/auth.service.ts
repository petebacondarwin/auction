import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { User } from '@firebase/auth-types';

import { shareReplay } from 'rxjs/operators';

export { User } from '@firebase/auth-types';

export interface SignupInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
  childDetails: string;
  rememberMe: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Injectable()
export class Auth {
  userChanges = this.afAuth.authState.pipe(shareReplay(1));

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }

  async doGoogleLogin(): Promise<User> {
    await this.afAuth.auth.setPersistence(auth.Auth.Persistence.LOCAL);
    return await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<User> {
    await this.afAuth.auth.setPersistence(credentials.rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION);
    return await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  async doSignup(signUpInfo: SignupInfo): Promise<User> {
    await this.afAuth.auth.setPersistence(signUpInfo.rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION);
    return await this.afAuth.auth.createUserWithEmailAndPassword(signUpInfo.email, signUpInfo.password);
  }

  async doReset(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
