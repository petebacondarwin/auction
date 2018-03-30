import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginCredentials } from 'app/auth/auth.service';

const errorOrder = [
  'required',
  'email'
];

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
  signup = new EventEmitter();

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

  doSignup() {
    this.signup.emit();
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
