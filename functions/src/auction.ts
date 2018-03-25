import { Event, firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';

import { Bid, BidInfo, Item } from '../../src/app/models';

export const auctionItemAdded = firestore.document('auction-items/{itemId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    const category = action.data.get('category');
    const db = admin.firestore();
    const itemsInCategory = await db.collection('auction-items').where('category', '==', category).get();
    const itemCount = itemsInCategory.size;
    console.log(`change to ${action.params['itemId']}: updating ${category} to ${itemCount}`);
    return await db.doc(`categories/${category}`).update('itemCount', itemCount);
  });
