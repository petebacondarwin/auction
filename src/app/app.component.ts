import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/auth';

import { Destroyable } from 'app/destroyable';
import { LoginComponent } from 'app/auth/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyable implements OnInit {

  user: User;
  readonly currentYear = new Date().getFullYear();

  constructor(
    private titleService: Title,
    private afAuth: AngularFireAuth,
    private router: Router,
    private location: Location,
    private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.afAuth.authState
      .pipe(this.takeUntilDestroyed())
      .subscribe(user => this.user = user);
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/');
  }
}
