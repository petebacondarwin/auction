import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Auth } from 'app/auth/auth.service';

const errorOrder = [
  'required',
  'email'
];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  error: string;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private dialog: MatDialogRef<LoginComponent, boolean>, public auth: Auth) {}

  loginViaEmail() {
    if(this.loginForm.valid) {
      this.auth.loginViaEmail(this.loginForm.value.email, this.loginForm.value.password)
        .then((result) => result && this.dialog.close(), err => this.error = err);
    }
  }

  loginViaGoogle() {
    this.auth.loginViaGoogle()
      .then((result) => result && this.dialog.close(), err => this.error = err);
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
