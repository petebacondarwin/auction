import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const errorOrder = [
  'required',
  'email'
];

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
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
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(true),
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
