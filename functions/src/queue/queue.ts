import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { updateUserInfoEmails } from './updateUserInfoEmails';
import { sendAuctionClosedNotifications, sendBidUpdateNotifications } from './bidNotifications';

let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;

export const processQueue = firestore.document('queue/{itemId}')
  .onCreate(async (action) => {
    db = db || admin.firestore();
    auth = auth || admin.auth();
    const queueItem = action.data.data();
    console.log('processing started on', queueItem);
    switch(queueItem.action) {
      case 'bid-update-notification':
        await sendBidUpdateNotifications(db).catch(e => console.error(e));
        break;
      case 'auction-closed-notification':
        await sendAuctionClosedNotifications(db, auth).catch(e => console.error(e))
        break;
      case 'update-emails':
        await updateUserInfoEmails(db, auth).catch(e => console.error(e));
        break;
      default:
        console.error('unknown queue action', action.data.get('action'));
    }
    await db.collection('queue').doc(action.data.id).delete();
    console.log('processing complete on', queueItem);
  });


