import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly user = this.afAuth.authState;
  readonly currentYear = new Date().getFullYear();

  constructor(
    public router: Router,
    private titleService: Title,
    private afAuth: AngularFireAuth) {}

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }
}
