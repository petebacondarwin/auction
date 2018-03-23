import { Component, EventEmitter, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { combineLatest, map, switchMap, shareReplay, tap , distinctUntilChanged} from 'rxjs/operators';

import { AppComponent } from 'app/app.component';
import { Category, Item } from 'app/models';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent extends Destroyable {

  isWide: boolean;
  categories: Observable<Category[]>;
  category: Observable<Category>;
  items: Observable<Item[]>;
  item: Observable<Item>;

  constructor(
    app: AppComponent,
    activeRoute: ActivatedRoute,
    router: Router,
    storage: Storage,
    breakpoints: BreakpointObserver
  ) {
    super();

    console.log('AuctionComponent');

    app.setPageTitle('Auction');

    breakpoints.observe([Breakpoints.Large, Breakpoints.XLarge])
      .pipe(this.takeUntilDestroyed())
      .subscribe(breakpoint => this.isWide = breakpoint.matches);

    const params = activeRoute.paramMap.pipe(this.takeUntilDestroyed());

    this.categories = storage.categoriesChanges.pipe(
      shareReplay(1)
    );

    this.category = params.pipe(
      map(params => params.get('category')),
      distinctUntilChanged(),
      combineLatest(this.categories, (categoryId, categories) => categories.find(category => category.id === categoryId)),
      shareReplay(1)
    );

    this.items = this.category.pipe(
      switchMap(category => storage.getAuctionItemsByCategory(category && category.id)),
      shareReplay(1)
    );

    this.item = params.pipe(
      map(params => params.get('item')),
      distinctUntilChanged(),
      combineLatest(this.items, (itemId, items) => items.find(item => item.id === itemId)),
      shareReplay(1)
    );
  }
}
