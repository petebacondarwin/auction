import { Event, firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';

export const auctionItemAdded = firestore.document('auction-items/{itemId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    const category = action.data.get('category');
    const db = admin.firestore();
    const itemsInCategory = await db.collection('auction-items').where('category', '==', category).get();
    const itemCount = itemsInCategory.size;
    console.log(`change to ${action.params['itemId']}: updating ${category} to ${itemCount}`);
    return await db.doc(`categories/${category}`).update('itemCount', itemCount);
  });

export const bidEntered = firestore.document('bids/{bidId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    const db = admin.firestore();
    const itemId = action.data.get('item') as string;
    const item = (await db.collection('auction-items').doc(itemId).get()).data();
    const winningBids = (await db.collection('bids')
                          .where('item', '==', itemId)
                          .orderBy('amount', 'desc')
                          .orderBy('timestamp')
                          .limit(item.quantity).get()).docs;
    console.log(winningBids.map(bid => ({ bidder: bid.get('bidder'), amount: bid.get('amount') })));
    await db.collection('bid-info').doc(itemId).set({
      winningBids: winningBids.map(bid => bid.get('amount')),
      bidCount: winningBids.length
    });
  });
