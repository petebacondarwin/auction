import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface SignupInfo {
  name: string;
  email: string;
  password: string;
  phone: string;
  childDetails: string;
  rememberMe: boolean;
}

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

  signUp: EventEmitter<SignupInfo> = new EventEmitter();

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      this.signUp.emit(this.signupForm.value);
    }
  }
}
