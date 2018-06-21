import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserInfo as _UserInfo, Item as _Item, Bid } from './auction';
import { sendEmail, getFooter, getTableStyling } from './email';

let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;

interface Item extends _Item {
  bids: Bid[];
  priceToBeat: number;
}

interface UserItemInfo {
  item: Item;
  userBids: Bid[];
  winning: boolean;
}

export interface UserInfo extends _UserInfo {
  items: UserItemInfo[];
}


export const processQueue = firestore.document('queue/{itemId}')
  .onCreate(async (action) => {
    db = db || admin.firestore();
    const queueItem = action.data.data();
    console.log('processing started on', queueItem);
    switch(queueItem.action) {
      case 'bid-update-notification':
        await sendBidUpdateNotifications().catch(e => console.log(e));
        break;
      case 'update-emails':
        await updateUserInfoEmails().catch(e => console.log(e));
      default:
        console.error('unknown queue action', action.data.get('action'));
    }
    await db.collection('queue').doc(action.data.id).delete();
    console.log('processing complete on', queueItem);
  });


async function sendBidUpdateNotifications() {
  auth = auth || admin.auth();
  db = db || admin.firestore();

  const userList = await db.collection('users').where('notify', '==', true).get();
  const users = userList.docs
    .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as any as UserInfo))
    // .filter(user => user.email === 'pete@bacondarwin.com') // TODO - remove
    .filter(user => user.notify);

  const allBids = await getBids();
  const items = await getItems(allBids);

  users.forEach(user => updateUserInfo(user, items, allBids));

  console.log('Sending bid update notifications to', users.map(user => ({ id: user.id, email: user.email })));
  await Promise.all(users.map(async user => {
    console.log(user);
    await sendEmail(user.email, 'Coleridge Summer Fair - Auction Update', user.items.length ? getBidUpdateText(user) : getNoBidsText(user));
  }));
}

async function getBids() {
  return (await db.collection('bids').get()).docs.map(doc => ({id: doc.id, ...doc.data() } as Bid));
}

async function getItems(allBids: Bid[]) {
  const itemMap = await getMapFromCollection<Item>('auction-items');
  itemMap.forEach(item => item.bids = []);
  allBids.forEach(bid => {
    itemMap.get(bid.item)!.bids.push(bid);
  });
  itemMap.forEach(item => {
    item.bids.sort(compareBids);
    item.priceToBeat = item.bids[item.quantity] && item.bids[item.quantity].amount || 0;
  });
  return itemMap;
}

function updateUserInfo(user: UserInfo, items: Map<string, Item>, bids: Bid[]) {
  user.items = [];
  // Add user bids to each user info
  bids.forEach(bid => {
    if (bid.bidder === user.id) {
      const item = items.get(bid.item)!;
      const userItemIndex = user.items.findIndex(i => i.item === item);
      const userItem = user.items[userItemIndex] || { item, userBids: [], winning: false };
      if (userItemIndex === -1) {
        user.items.push(userItem);
      }
      userItem.userBids.push(bid);
    }
  });

  // compute whether the user is winning each of their items
  user.items.forEach(userItem => {
    userItem.userBids.sort(compareBids);
    userItem.winning = !!userItem.userBids.length && userItem.item.bids.indexOf(userItem.userBids[0]) < userItem.item.quantity;
  });
}

function compareBids(a: Bid, b: Bid) {
  return b.amount - a.amount || a.timestamp.valueOf() - b.timestamp.valueOf();
}

function getNoBidsText(user: UserInfo) {
  return `<!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
      <title>Coleridge Summer Fair - Auction Bids</title>
    </head>
    <body>
    <p>
      This is an update on the Coleridge Summer Fair Auction.
    </p>
    <p><strong>So far you have not placed any bids.</strong></p>
    <p>
      Don't forget to take a look at the items on offer at
      <a href="https://coleridge-summer-fair.org/auction">the auction website</a>.
      Bidding is online only throughout the week and then at the fair.
    </p>
    ${getFooter()}
  </body>
  <html>`;
}

function getBidUpdateText(user: UserInfo) {
  return `<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
    <title>Coleridge Summer Fair - Auction Bids</title>
    <style>
    h2 { font-size: 1.2em; margin: 24px 0 0; }
    p, ul { margin: 0; }
    .red { color: red; }
    .green { color: green; }
    .footer { margin-top: 25px; }
    </style>
  </head>
  <body>
  <p>
    <strong>This is an update on your bidding at the Coleridge Summer Fair Auction.</strong><br>
    Don't forget that bidding is online only throughout the week and at the fair
    via <a href="https://coleridge-summer-fair.org/auction">the auction website</a>.
  </p>
  ${ user.items.map(userItem => `
  <h2>
    <a href="https://coleridge-summer-fair.org/auction;item=${userItem.item.id}">${userItem.item.title}</a><br>
    <small>Lot no. ${userItem.item.lot}</small>
  </h2>
  ${ userItem.winning ?
    `<p class="green"><strong>You are currently winning this item.</strong></p>` :
    `<p class="red"><strong>You have been outbid on this item.
    Click <a href="https://coleridge-summer-fair.org/auction;item=${userItem.item.id}">here</a> to bid again.
    Price to beat: &pound;${userItem.item.priceToBeat}.</strong></p>`
  }
  <p>Your bids</p>
  <ul>
    ${ userItem.userBids.map(bid => `<li>&pound;${bid.amount}</li>`).join('\n') }
  </ul>
  `).join('\n') }
  ${getFooter()}
  </body>
</html>`;
}


async function getMapFromCollection<T>(collectionName: string): Promise<Map<string, T>> {
  const map = new Map<string, T>();
  (await db.collection(collectionName).get()).docs.forEach(doc => map.set(doc.id, {id: doc.id, ...doc.data() } as any));
  return map;
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

