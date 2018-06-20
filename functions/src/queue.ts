import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserInfo } from './auction';
import { sendEmail } from './email';

let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;

export const processQueue = firestore.document('queue/{itemId}')
  .onCreate(async (action) => {
    db = db || admin.firestore();
    const queueItem = action.data.data();
    console.log('processing started on', queueItem);
    try {
      switch(queueItem.action) {
        case 'bid-update-notification':
          await sendBidUpdateNotifications();
          break;
        case 'update-emails':
          await updateUserInfoEmails();
        default:
          console.error('unknown queue action', action.data.get('action'));
      }
    } catch(e) {
      console.error(e);
    } finally {
      await db.collection('queue').doc(action.data.id).delete();
      console.log('processing complete on', queueItem);
    }
  });


async function sendBidUpdateNotifications() {
  auth = auth || admin.auth();
  console.log('emailing users');
  const userList = await db.collection('users').where('notify', '==', true).get();
  const users = userList.docs
    .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as any as UserInfo))
    .filter(user => user.email === 'pete@bacondarwin.com') // TODO - remove
    .filter(user => user.notify)

  console.log(users.map(user => ({ id: user.id, email: user.email })));
}

// This function was just a helper to migrate over the email addresses from the
// authentication service to the firestore database, so that we can run a report
// on the website that contains email addresses.
// Going forward this shouldn't be necessary since the system now copies over these
// addresses whenever a user logs in.
async function updateUserInfoEmails() {
  auth = auth || admin.auth();
  db = db || admin.firestore();

  const userList = await auth.listUsers();
  await Promise.all(userList.users.map(async user => {
    const userInfo = await db.collection('users').doc(user.uid).get();
    if (userInfo) {
      if (userInfo.get('email')) {
        console.log('processing', user.uid, 'already has an email address stored', userInfo.get('email'), user.email);
      } else {
        await userInfo.ref.update({ email: user.email });
        console.log('processing', user.uid, 'updated email address to', user.email);
      }
    } else {
      console.error('missing userInfo for', user.uid, user.email);
    }
  }));
}