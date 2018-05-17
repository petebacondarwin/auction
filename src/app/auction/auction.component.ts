import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { combineLatest, map, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { AppComponent } from 'app/app.component';
import { Bid, Category, Item, UserInfo } from 'app/models';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';
import { UserService } from 'app/auth/user.service';

interface ItemSelected {
  item: Item;
  category?: Category;
}

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
  userInfo: Observable<UserInfo>;

  constructor(
    public app: AppComponent,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private user: UserService
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

    this.userInfo = this.user.userInfoChanges;

    this.items = this.category.pipe(
      switchMap(category => this.storage.getAuctionItemsByCategory(category && category.id)),
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

  select({category, item}: ItemSelected) {
    const routeCommand: any = { item: item.id };
    if (category) {
      routeCommand.category = category.id;
    }
    this.router.navigate([routeCommand], {relativeTo: this.activeRoute});
  }
}
