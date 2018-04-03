import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Login } from 'app/auth/login.service';
import { Storage } from 'app/storage.service';
import { UserInfoComponent } from 'app/auth/user-info/user-info.component';
import { UserInfo } from 'app/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userInfo = this.login.userInfoChanges;

  constructor(
    private login: Login,
    private storage: Storage,
    private dialog: MatDialog
  ) { }

  editUserInfo(userInfo: UserInfo) {
    const data = { data: { userInfo, message: 'Please update your user info' } };
    const dialog: MatDialogRef<UserInfoComponent, UserInfo> = this.dialog.open(UserInfoComponent, data);
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.storage.updateUserInfo(userInfo.user, result);
      }
    });
  }
}
