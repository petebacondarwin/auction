import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, LoginCredentials, User } from 'app/auth/auth.service';
import { SignupComponent } from 'app/auth/signup/signup.component';


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
    if (this.loginForm.valid) {
      try {
        const user = await this.auth.doEmailLogin(this.loginForm.value as LoginCredentials);
      } catch (e) {
        this. error = e;
      }
    }
  }

  async loginViaGoogle() {
    try {
      const user = await this.auth.doGoogleLogin();
    } catch (e) {
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

  showSignup() {
    const dialog: MatDialogRef<SignupComponent> = this.dialog.open(SignupComponent);
  }
}
