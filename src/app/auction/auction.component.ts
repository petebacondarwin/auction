import { Component, EventEmitter, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Category, Item } from 'app/models';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent extends Destroyable {

  isWide: boolean;

  categories = this.storage.categoriesChanges;
  currentCategory = new BehaviorSubject<Category>(null);
  items = this.currentCategory.pipe(
    switchMap(category => this.storage.getAuctionItemsByCategory(category && category.id)),
    tap(list => console.log(list))
  );

  constructor(
    app: AppComponent,
    private storage: Storage,
    breakpoints: BreakpointObserver
  ) {
    super();

    app.setPageTitle('Auction');
    breakpoints.observe([
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(this.takeUntilDestroyed())
      .subscribe(breakpoint => this.isWide = breakpoint.matches);
  }

  setCurrentCategory(category: Category) {
    this.currentCategory.next(category);
  }
}
