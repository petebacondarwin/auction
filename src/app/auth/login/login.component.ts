import { Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

const errorOrder = [
  'required',
  'email'
];

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  message: string;
  error: string;

  emailLogin = new EventEmitter<LoginCredentials>();
  googleLogin = new EventEmitter();

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required)
  });

  loginViaEmail() {
    if (this.loginForm.valid) {
      this.emailLogin.emit(this.loginForm.value as LoginCredentials);
    }
  }

  loginViaGoogle() {
    this.googleLogin.emit();
  }

  firstError(controlName: string) {
    const errors = this.loginForm.get(controlName).errors;
    if (errors) {
      for (const errorCode of errorOrder) {
        if (errors[errorCode]) {
          return errorCode;
        }
      }
    }
  }
}
