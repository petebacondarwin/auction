import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, takeUntil, shareReplay} from 'rxjs/operators';

import { Destroyable } from 'app/destroyable';
import { Category, Item, BidInfo, Bid } from 'app/models';
import { withId } from 'app/utils';

const emptyBidInfo: BidInfo = { bidCount: 0, winningBids: [] };

@Injectable()
export class Storage extends Destroyable {

  private categoriesCol = this.afStore.collection<Category>('categories', ref => ref.where('itemCount', '>', 0));
  private auctionItemsCol = this.afStore.collection<Item>('auction-items');
  private bidInfoCol = this.afStore.collection<BidInfo>('bid-info');
  private raffleItemsCol = this.afStore.collection<Item>('raffle-items');
  private magicBoxItemsCol = this.afStore.collection<Item>('magic-box-items');
  private bidsCol = this.afStore.collection<Bid>('bids');


  categoriesChanges = this.getColChangesWithId(this.categoriesCol);
  auctionItemsChanges = combineLatest(
    this.getColChangesWithId(this.auctionItemsCol),
    this.getCollectionMap(this.bidInfoCol),
    (items, bidInfo) => items.map(item => ({ ...item, bidInfo: (bidInfo[item.id] || emptyBidInfo) }))
  );
  raffleItemsChanges = this.getColChangesWithId(this.raffleItemsCol);
  magicBoxItemsChanges = this.getColChangesWithId(this.magicBoxItemsCol);

  constructor(private afStore: AngularFirestore) {
    super();
  }

  getBidsForUser(userId: string) {
    return this.afStore.collection<Bid>('bids', ref => ref.where('bidder', '==', userId)).valueChanges();
  }

  getAuctionItemsByCategory(categoryId: string) {
    return this.auctionItemsChanges.pipe(
      map(items => items.filter(item => !categoryId || item.category === categoryId)),
      shareReplay(1),
    );
  }

  deleteAllItems(collection: string) {
    return this.afStore.collection<Item>(collection).ref.get().then(itemsSnaphot => {
      const batch = this.afStore.firestore.batch();
      itemsSnaphot.docs.forEach(item => batch.delete(item.ref));
      return batch.commit();
    });
  }

  addItems(collection: string, items: Item[]) {
    const batch = this.afStore.firestore.batch();
    items.forEach(item => {
      if (item.lot) {
        const ref = this.afStore.firestore.collection(collection).doc(item.lot.toString());
        batch.set(ref, item);
      }
    });
    return batch.commit();
  }

  bidOnItem(bid: Bid) {
    return this.bidsCol.ref.add({ ...bid, timestamp: firestore.FieldValue.serverTimestamp() });
  }

  private getColChangesWithId<T>(collection: AngularFirestoreCollection<T>) {
    return collection.snapshotChanges().pipe(
      map(changes => withId<T>(changes)),
      shareReplay(1),
    );
  }

  private getCollectionMap<T>(collection: AngularFirestoreCollection<T>): Observable<{[key: string]: T}> {
    return collection.snapshotChanges().pipe(
      map(changes => {
        const mapping = Object.create(null);
        changes.forEach(change => mapping[change.payload.doc.id] = change.payload.doc.data());
        return mapping;
      }),
      shareReplay(1)
    );
  }
}
