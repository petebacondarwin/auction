import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, LoginCredentials, User } from 'app/auth/auth.service';
import { SignupComponent } from 'app/auth/signup/signup.component';
import { ResetComponent } from 'app/auth/reset/reset.component';
import { touchForm } from 'app/utils';

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

  loggingIn = false;
  error: string;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(true),
  });

  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<LoginComponent, User>,
    @Inject(MAT_DIALOG_DATA) public message: string) {}

  async loginViaEmail() {
    touchForm(this.loginForm);
    if (this.loginForm.valid) {
      try {
        this.loggingIn = true;
        const user = await this.auth.doEmailLogin(this.loginForm.value as LoginCredentials);
      } catch (e) {
        this.loggingIn = false;
        this. error = e;
      }
    }
  }

  async loginViaGoogle() {
    try {
      this.loggingIn = true;
      const user = await this.auth.doGoogleLogin();
    } catch (e) {
      this.loggingIn = false;
      this. error = e;
    }
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

  showReset() {
    const dialog: MatDialogRef<ResetComponent> = this.dialog.open(ResetComponent, { data: this.loginForm.get('email').value });
    dialog.afterClosed().subscribe(() => this.loggingIn = false);
  }

  showSignup() {
    const dialog: MatDialogRef<SignupComponent> = this.dialog.open(SignupComponent);
    dialog.afterClosed().subscribe(() => this.loggingIn = false);
  }
}
