import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/auth';

import { Destroyable } from 'app/destroyable';

@Injectable()
export class Auth extends Destroyable {
  constructor(
    private afAuth: AngularFireAuth,
  ) {
    super();
  }
}