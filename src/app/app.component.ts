import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';

import { UserService } from 'app/auth/user.service';
import { Destroyable } from 'app/destroyable';
import { Config } from 'app/models';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends Destroyable implements OnInit {

  readonly currentYear = new Date().getFullYear();
  isWide: boolean;
  userInfo = this.user.userInfoChanges;
  config: Config;

  constructor(
    public user: UserService,
    private storage: Storage,
    private breakpoints: BreakpointObserver,
    private titleService: Title
  ) {
    super();
  }

  ngOnInit() {
    this.breakpoints.observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(this.takeUntilDestroyed())
      .subscribe(breakpoint => this.isWide = breakpoint.matches);
    this.storage.configChanges
      .pipe(this.takeUntilDestroyed())
      .subscribe(config => this.config = config[0]);
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }

  doLogin() {
    this.user.ensureLoggedIn('Please choose a method to login.').subscribe();
  }
}
