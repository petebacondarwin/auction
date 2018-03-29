import { Component, OnInit } from '@angular/core';

import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userInfo = this.storage.userInfoChanges;

  constructor(public storage: Storage) { }

  ngOnInit() {
  }

}
