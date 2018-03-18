import { Event, firestore, config} from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(config().firebase);

async function updateItemCount(action: Event<firestore.DeltaDocumentSnapshot>) {
  const category = action.data.get('category');
  const db = admin.firestore();
  const querySnaphshot = await db.collection('auction-items').where('category', '==', category).get();
  const itemCount = querySnaphshot.size;
  console.log(`change to ${action.params['itemId']}: updating ${category} to ${itemCount}`);
  return await db.doc(`categories/${category}`).update('itemCount', itemCount);
}

export const auctionItemAdded = firestore.document('auction-items/{itemId}').onWrite(updateItemCount);
