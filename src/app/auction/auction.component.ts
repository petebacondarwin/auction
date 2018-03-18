import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Category, Item } from 'app/models';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { withId } from 'app/utils';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnDestroy {

  isWide: boolean;

  categories: Observable<Category[]>;
  currentCategory = new BehaviorSubject<Category>(null);
  items: Observable<Item[]>;

  private onDestroy$ = new EventEmitter<void>();

  constructor(
    app: AppComponent,
    afs: AngularFirestore,
    breakpoints: BreakpointObserver
  ) {
    app.setPageTitle('Auction');

    this.categories = afs.collection<Category>('categories').snapshotChanges().pipe(
      map(changes => withId<Category>(changes))
    );

    const allItems = afs.collection<Item>('auction-items').snapshotChanges().pipe(
      map(changes => withId<Item>(changes))
    );

    this.items = Observable.combineLatest(
      allItems,
      this.currentCategory,
      (items, category) => items.filter(item => !category || item.category === category.id)
    );

    breakpoints.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(breakpoint => this.isWide = breakpoint.matches);
  }

  setCurrentCategory(category: Category) {
    this.currentCategory.next(category);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
