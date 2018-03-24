import { auth, Event, firestore, config} from 'firebase-functions';
import * as admin from 'firebase-admin';
import { setApiKey, send } from '@sendgrid/mail';

setApiKey(config().sendgrid.api_key);
admin.initializeApp(config().firebase);

async function sendWelcomeEmail(event: Event<any>) {
  const user = event.data;
  await sendEmail(user.email, `Welcome to the Coleridge Summber!`, `Hey ${user.displayName || ''}! Welcome to the Coleridge Summer Fair.`);
}

exports.sendWelcomeEmail = auth.user().onCreate(sendWelcomeEmail);

async function updateItemCount(action: Event<firestore.DeltaDocumentSnapshot>) {
  const category = action.data.get('category');
  const db = admin.firestore();
  const querySnaphshot = await db.collection('auction-items').where('category', '==', category).get();
  const itemCount = querySnaphshot.size;
  console.log(`change to ${action.params['itemId']}: updating ${category} to ${itemCount}`);
  return await db.doc(`categories/${category}`).update('itemCount', itemCount);
}

export const auctionItemAdded = firestore.document('auction-items/{itemId}').onWrite(updateItemCount);


async function sendEmail(to: string, subject: string, text: string) {
  await send({
    from: `Coleridge Summer Fair <info@coleridge-summer-fair.org>`,
    to,
    subject,
    text
  })
  console.log('Email sent to:', to);
}