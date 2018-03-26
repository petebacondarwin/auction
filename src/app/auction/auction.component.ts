import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { AppComponent } from 'app/app.component';
import { Category, Item, Bid } from 'app/models';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent extends Destroyable implements OnInit {

  categories: Observable<Category[]>;
  category: Observable<Category>;
  items: Observable<Item[]>;
  item: Observable<Item>;

  constructor(
    public app: AppComponent,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
  ) {
    super();
  }

  ngOnInit() {
    this.app.setPageTitle('Auction');

    const params = this.activeRoute.paramMap.pipe(this.takeUntilDestroyed());

    this.categories = this.storage.categoriesChanges.pipe(
      shareReplay(1)
    );

    this.category = params.pipe(
      map(p => p.get('category')),
      distinctUntilChanged(),
      combineLatest(this.categories, (categoryId, categories) => categories.find(category => category.id === categoryId)),
      shareReplay(1)
    );

    const bidInfo = this.storage.bidInfoChanges;

    this.items = this.category.pipe(
      switchMap(category => this.storage.getAuctionItemsByCategory(category && category.id)),
      combineLatest(
      bidInfo,
      (items, info) => items.map(item => ({ ...item, bidInfo: info[item.id] || { bidCount: 0, winningBids: [] } }))),
      shareReplay(1)
    );

    this.item = params.pipe(
      map(p => p.get('item')),
      distinctUntilChanged(),
      combineLatest(this.items, (itemId, items) => items.find(item => item.id === itemId)),
      shareReplay(1)
    );
  }

  bid(bid: Bid) {
    console.log('bid', bid);
    this.storage.bidOnItem(bid);
  }
}
