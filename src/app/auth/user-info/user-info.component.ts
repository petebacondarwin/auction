import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from 'app/models';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  userInfoForm = new FormGroup({
    displayName: new FormControl(this.data.userInfo.user.displayName),
    phone: new FormControl(this.data.userInfo.phone),
    childDetails: new FormControl(this.data.userInfo.childDetails),
    notify: new FormControl(this.data.userInfo.notify || true)
  });
  message = this.data.message;

  constructor(
    private dialog: MatDialogRef<UserInfoComponent, UserInfo>,
    @Inject(MAT_DIALOG_DATA) private data: { message: string, userInfo: UserInfo }
  ) {}

  saveUserInfo() {
    this.dialog.close(this.userInfoForm.value);
  }
}
