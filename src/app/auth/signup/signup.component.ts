import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Auth, SignupInfo, User } from 'app/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {

  error: any;

  signupForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(true),
  });

  constructor(private auth: Auth, private dialog: MatDialogRef<SignupComponent, User>) {}

  async onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      try {
        const user = await this.auth.doSignup(this.signupForm.value);
        this.dialog.close(user);
      } catch (e) {
        this. error = e;
      }
    }
  }
}
