import { Component } from '@angular/core';

import { Login } from 'app/auth/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userInfo = this.login.userInfoChanges;
  constructor(public login: Login) { }
}
