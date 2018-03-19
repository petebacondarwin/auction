import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

import { Destroyable } from 'app/destroyable';

const errorOrder = [
  'required',
  'email'
];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends Destroyable implements OnInit {

  error: string;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private dialog: MatDialogRef<LoginComponent, boolean>, private afAuth: AngularFireAuth) {
    super();
  }

  ngOnInit() {
    this.afAuth.authState
      .pipe(this.takeUntilDestroyed())
      .subscribe(user => user && this.dialog.close(true));
  }


  loginViaGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .catch(err => this.error = err)
  }

  loginViaEmail(formData) {
    if(formData.valid) {
      this.afAuth.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password)
        .catch(err => this.error = err);
    }
  }

  firstError(controlName: string) {
    const errors = this.loginForm.get(controlName).errors;
    if (errors) {
      for(let errorCode of errorOrder) {
        if (errors[errorCode]) {
          return errorCode;
        };
      }
    }
  }
}
