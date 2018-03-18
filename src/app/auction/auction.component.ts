import { Component } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Category, Item } from 'app/models';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators';
import { withId } from 'app/utils';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent {

  categories: Observable<Category[]>;
  currentCategory =  new ReplaySubject<Category>(1);
  items: Observable<Item[]>;

  constructor(
    app: AppComponent,
    afs: AngularFirestore,
  ) {
    app.setPageTitle('Auction');
    this.currentCategory.next(null);

    this.categories = afs.collection<Category>('categories').snapshotChanges().pipe(
      map(changes => withId(changes))
    );

    const allItems = afs.collection<Item>('items').snapshotChanges().pipe(
      map(changes => withId<Item>(changes))
    );

    this.items = Observable.combineLatest(
      allItems,
      this.currentCategory,
      (items, category) => items.filter(item => !category || item.category === category.id)
    );
  }

  filter(category: Category) {
    this.currentCategory.next(category);
  }
}
