import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';

import { first } from 'rxjs/operators';

import { Auth } from 'app/auth/auth.service';
import { UserService } from 'app/auth/user.service';
import { Storage } from 'app/storage.service';
import { Destroyable } from 'app/destroyable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyable implements OnInit {

  readonly currentYear = new Date().getFullYear();
  isWide: boolean;
  userInfo = this.user.userInfoChanges;

  constructor(
    public user: UserService,
    public auth: Auth,
    public storage: Storage,
    private breakpoints: BreakpointObserver,
    private titleService: Title
  ) {
    super();
  }

  ngOnInit() {
    this.breakpoints.observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(this.takeUntilDestroyed())
      .subscribe(breakpoint => this.isWide = breakpoint.matches);
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }

  doLogin() {
    this.user.ensureLoggedIn('Please choose a method to login.').subscribe();
  }
}
