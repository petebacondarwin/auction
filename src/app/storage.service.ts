import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { User } from '@firebase/auth-types';

import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, shareReplay } from 'rxjs/operators';

import { Destroyable } from 'app/destroyable';
import { Category, Item, BidInfo, Bid, UserInfo, UserBidding } from 'app/models';
import { withId } from 'app/utils';

const emptyBidInfo: BidInfo = { bidCount: 0, winningBids: [] };

export interface UserItemBidInfoMap {
  [itemId: string]: UserBidding;
}

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
  raffleItemsChanges = this.getColChangesWithId(this.raffleItemsCol).pipe(
    map(items => items.sort((a, b) => b.value - a.value))
  );
  magicBoxItemsChanges = this.getColChangesWithId(this.magicBoxItemsCol);

  constructor(private afStore: AngularFirestore) {
    super();
  }

  updateDoc(collectionName: string, docId: string, value: object) {
    return this.afStore.doc(`${collectionName}/${docId}`).set(value, { merge: true });
  }

  getAuctionItemsByCategory(categoryId: string) {
    return this.auctionItemsChanges.pipe(
      map(items => items
        .filter(item => !categoryId || item.category === categoryId)
        .sort((a, b) => itemValue(b) - itemValue(a))
      ),
      shareReplay(1),
    );
  }

  getBidReport() {
    combineLatest(
      this.getColChangesWithId(this.bidsCol),
      this.auctionItemsChanges,
      (bids, items) => items.map(item => {
        const winningBids = item.bidInfo.winningBids.map(bid => bids.find(b => b.id === bid.bid));
        // TODO!!!
        return { ...item, bidInfo: { ...item.bidInfo, winningBids } };
      }));
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

  getUserInfo(user: User): Observable<UserInfo> {
    return combineLatest(
      this.afStore.doc<UserInfo>(`users/${user.uid}`).valueChanges(),
      this.getUserBiddingInfo(user),
      this.auctionItemsChanges,
      (userInfo, userBids, allItems) => combineUserInfo(user, userInfo, userBids, allItems)
    );
  }

  getUserBiddingInfo(user: User) {
    return this.getColChangesWithId(this.afStore.collection<Bid>('bids', ref => ref.where('bidder', '==', user.uid)));
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

function combineUserInfo(user, userInfo, userBids, allItems) {
  const items: UserItemBidInfoMap = {};
  userBids.forEach(bid => {
    const itemBidInfo = items[bid.item] = (items[bid.item] || createUserItemBidInfo(allItems.find(i => i.id === bid.item)));
    itemBidInfo.bids.push(bid);
    if (itemBidInfo.item.bidInfo.winningBids.find(b => b.bid === bid.id)) {
      itemBidInfo.winning = true;
    }
  });
  return ({ user, ...userInfo, bidding: hashToArray(items) });
}

function createUserItemBidInfo(item: Item): UserBidding {
  return { item, winning: false, bids: [] };
}

function hashToArray(hash: object) {
  return Object.keys(hash).map(key => hash[key]);
}

function itemValue(item: Item) {
  let value = item.value;
  if (item.bidInfo.winningBids && item.bidInfo.winningBids[0] && item.bidInfo.winningBids[0] && item.bidInfo.winningBids[0].amount) {
    value = Math.max(item.value, item.bidInfo.winningBids[0].amount);
  }
  return value;
}
