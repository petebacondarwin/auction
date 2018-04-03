import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Auth } from 'app/auth/auth.service';
import { touchForm } from 'app/utils';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {

  reset = false;
  resetting = false;
  error: any;

  resetForm = new FormGroup({
    email: new FormControl(this.email, Validators.required)
  });

  constructor(
    private auth: Auth,
    @Inject(MAT_DIALOG_DATA) private email: string
  ) { }

  async onSubmit() {
    touchForm(this.resetForm);
    if (this.resetForm.valid) {
      try {
        this.resetting = true;
        await this.auth.doReset(this.resetForm.get('email').value);
        this.reset = true;
      } catch (e) {
        this.error = e;
      } finally {
        this.resetting = false;
      }
    }
  }
}
