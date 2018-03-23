import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { Destroyable } from 'app/destroyable';
import { Category, Item } from 'app/models';
import { withId } from 'app/utils';

@Injectable()
export class Storage extends Destroyable {

  private categoriesCol = this.afStore.collection<Category>('categories', ref => ref.where('itemCount', '>', 0));
  private auctionItemsCol = this.afStore.collection<Item>('auction-items');
  private raffleItemsCol = this.afStore.collection<Item>('raffle-items');
  private magicBoxItemsCol = this.afStore.collection<Item>('magic-box-items');

  categoriesChanges = this.getColChangesWithId<Category>(this.categoriesCol);
  auctionItemsChanges = this.getColChangesWithId<Item>(this.auctionItemsCol);
  raffleItemsChanges = this.getColChangesWithId<Item>(this.raffleItemsCol);
  magicBoxItemsChanges = this.getColChangesWithId<Item>(this.magicBoxItemsCol);

  constructor(private afStore: AngularFirestore) {
    super();
  }

  getAuctionItemsByCategory(categoryId: string) {
    return this.auctionItemsChanges.pipe(
      map(items => items.filter(item => !categoryId || item.category === categoryId))
    );
  }

  getAuctionItem(itemId: string) {
    return this.getDocChangesWithId(this.auctionItemsCol, itemId);
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
      if (item.lot) {
        const ref = this.afStore.firestore.collection('auction-items').doc(item.lot.toString());
        batch.set(ref, item);
      }
    });
    return batch.commit();
  }

  private getColChangesWithId<T>(collection: AngularFirestoreCollection<T>) {
    return collection.snapshotChanges().pipe(
      map(changes => withId<T>(changes))
    );
  }

  private getDocChangesWithId<T>(collection: AngularFirestoreCollection<T>, id: string): Observable<T> {
    return collection.doc(id).valueChanges().pipe(
      map(doc => ({ id, ...doc } as any))
    );
  }
}
