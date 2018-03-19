import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

import { Auth } from 'app/auth/auth.service';
import { LoginComponent } from 'app/auth/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly currentYear = new Date().getFullYear();

  constructor(
    public auth: Auth,
    private titleService: Title,
    private dialog: MatDialog
  ) {}

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }

  showLogin() {
    this.dialog.open(LoginComponent);
  }
}
