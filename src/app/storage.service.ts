import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Destroyable } from 'app/destroyable';
import { Category, Item } from 'app/models';
import { withId } from 'app/utils';

@Injectable()
export class Storage extends Destroyable {

  categoriesChanges = this.getChangesWithId<Category>('categories');
  auctionItemsChanges = this.getChangesWithId<Item>('auction-items');
  raffleItemsChanges = this.getChangesWithId<Item>('raffle-items');
  magicBoxItemsChanges = this.getChangesWithId<Item>('magic-box-items');

  constructor(private afStore: AngularFirestore) {
    super();
  }

  getAuctionItemsByCategory(categoryId: string) {
    return this.auctionItemsChanges.pipe(
      map(items => items.filter(item => !categoryId || item.category === categoryId))
    );
  }

  deleteAllAuctionItems() {
    return this.afStore.collection<Item>('auction-items').ref.get().then(itemsSnaphot => {
      const batch = this.afStore.firestore.batch();
      itemsSnaphot.docs.forEach(item => batch.delete(item.ref));
      return batch.commit();
    });
  }

  addAuctionItems(items: Item[]) {
    const batch = this.afStore.firestore.batch();
    items.forEach(item => {
      const ref = this.afStore.firestore.collection('auction-items').doc();
      batch.set(ref, item);
    });
    return batch.commit();
  }

  private getChangesWithId<T>(collection: string) {
    return this.afStore.collection<T>(collection).snapshotChanges().pipe(
      map(changes => withId<T>(changes))
    );
  }

}
