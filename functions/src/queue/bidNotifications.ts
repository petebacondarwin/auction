import * as admin from 'firebase-admin';
import { sendEmail, getFooter, getTableStyling } from '../email';
import { UserInfo as _UserInfo, Item as _Item, Bid } from '../auction';

export interface Item extends _Item {
  bids: Bid[];
  priceToBeat: number;
}

export interface UserItemInfo {
  item: Item;
  userBids: Bid[];
  winning: number;
}

export interface UserInfo extends _UserInfo {
  items: UserItemInfo[];
}


export async function sendAuctionClosedNotifications(db: FirebaseFirestore.Firestore, auth: admin.auth.Auth) {
  const users = await getUsersToNotify(db);
  const allBids = await getBids(db.collection('bids'));
  const items = await getItems(allBids, db.collection('auction-items'));
  const topItems = Array.from(items.values()).filter(item => item.topItem);
  users.forEach(user => updateUserInfo(user, items, allBids));

  console.log('Top items', topItems.map(item => `${item.lot}: ${item.title} (${item.priceToBeat})`));
  console.log('Sending bid update notifications to', users.map(user => ({ id: user.id, email: user.email })));
  await Promise.all(users.map(async user => {
    console.log(user);
    await sendEmail(user.email, 'Coleridge Summer Fair - Online Auction Closed', getAuctionClosedText(user, topItems));
  }));
}


export async function sendBidUpdateNotifications(db: FirebaseFirestore.Firestore) {
  const users = await getUsersToNotify(db);
  const allBids = await getBids(db.collection('bids'));
  const items = await getItems(allBids, db.collection('auction-items'));
  users.forEach(user => updateUserInfo(user, items, allBids));

  console.log('Sending bid update notifications to', users.map(user => ({ id: user.id, email: user.email })));
  await Promise.all(users.map(async user => {
    console.log(user);
    await sendEmail(user.email, 'Coleridge Summer Fair - Auction Update', user.items.length ? getBidUpdateText(user) : getNoBidsText(user));
  }));
}

async function getUsersToNotify(db: FirebaseFirestore.Firestore) {
  const userList = await db.collection('users').where('notify', '==', true).get();
  return userList.docs
    .map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as any as UserInfo))
    // .filter(user => user.email === 'pete@bacondarwin.com') // TODO - remove
    .filter(user => user.notify);
}

async function getBids(bidCollection: FirebaseFirestore.CollectionReference) {
  return (await bidCollection.get()).docs.map(doc => ({id: doc.id, ...doc.data() } as Bid));
}

async function getItems(allBids: Bid[], auctionCollection: FirebaseFirestore.CollectionReference) {
  const itemMap = await getMapFromCollection<Item>(auctionCollection);
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
      const userItem = user.items[userItemIndex] || { item, userBids: [], winning: 0 };
      if (userItemIndex === -1) {
        user.items.push(userItem);
      }
      userItem.userBids.push(bid);
    }
  });

  // compute whether the user is winning each of their items
  user.items.forEach(userItem => {
    userItem.userBids.sort(compareBids);
    if (!!userItem.userBids.length && userItem.item.bids.indexOf(userItem.userBids[0]) < userItem.item.quantity) {
      userItem.winning++;
    }
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
      Coleridge Summer Fair is about to start. Don't forget about the online auction.
    </p>
    <p><strong>So far you have not placed any bids.</strong></p>
    <p>
      Don't forget to take a look at the items on offer at
      <a href="https://coleridge-summer-fair.org/auction">the auction website</a>.
      Bidding is online only throughout the fair.
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
  <h2>Summer Fair Today from 12pm!</h2>
  <p>
    <strong>This is an update on your bidding at the Coleridge Summer Fair Auction.</strong><br>
    Don't forget that bidding continues only throughout the fair
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


function getAuctionClosedText(user: UserInfo, topItems: Item[]) {
  return `
  <html lang="en-GB">
  <head>
    <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
    <title>Coleridge Summer Fair - Auction Bids</title>
    <style>
    h2 { font-size: 1.2em; margin: 24px 0 0; }
    p, ul { margin: 0; }
    .footer { margin-top: 25px; }
    </style>
    ${getTableStyling()}
  </head>
  <body>
  <h2>Online auction closed</h2>
  <p>
    The online bidding has now closed.
  </p>
  <h2>Top prize live bidding</h2>
  <p>
    The top items will now be auctioned off in live bidding to take place directly after the raffle draw
    starting around 3.30pm. Please come to the main hall to continue to bid on these top items.
  </p>
  <table>
  <thead><tr><th>Lot No.</th><th>Price to beat</th><th>Item</th></thead>
  <tbody>
  ${ topItems.map(item => `
    <tr>
      <td>${item.lot}</td>
      <td> &pound;${item.priceToBeat}</td>
      <td>
        <strong><a href="http://coleridge-summer-fair.org/auction;${item.lot}">${item.title}</a></strong>
      </td>
    </tr>`).join('\n') }
    </tbody>
  </table>
  <h2>Your prizes</h2>
  ${ user.items.filter(itemInfo => !itemInfo.item.topItem && itemInfo.winning).length ? `
  <p>
    You have won the following items. Please come to the main hall to pay for and collect your prizes by 4pm
    or arrange to pay for and collect them next week.
  </p>
  <table>
    <thead><tr><th>Lot No.</th><th>Amount to pay</th><th>Item</th></thead>
    <tbody>
    ${ user.items
        .filter(itemInfo => !itemInfo.item.topItem && itemInfo.winning)
        .map(itemInfo => itemInfo.userBids
                          .filter(bid => itemInfo.item.bids.indexOf(bid) !== -1)
                          .map(bid => `
    <tr>
      <td>${itemInfo.item.lot}</td>
      <td> &pound;${bid.amount}</td>
      <td>
        <strong><a href="http://coleridge-summer-fair.org/auction;${itemInfo.item.lot}">${itemInfo.item.title}</a></strong>
      </td>
    </tr>`).join('\n')).join('\n') }
    </tbody>
  </table>
  ` : `
  <p>
    You have not won any items in the online auction but you can still come and bid on the top items above.
  </p>
  `}

  <h2>Bidder details</h2>
  <table>
      <th>Email:</th>
      <td>${user.email}</td></tr>
    <tr>
      <th>Phone:</th>
      <td>${user.phone || '-- none provided --'}</td></tr>
    <tr>
      <th>Child info:</th>
      <td>${user.childDetails || '-- none provided --'}</td></tr>
  </table>
  ${getFooter()}
  </body>
  </html>
`;
}


async function getMapFromCollection<T>(collection: FirebaseFirestore.CollectionReference): Promise<Map<string, T>> {
  const map = new Map<string, T>();
  (await collection.get()).docs.forEach(doc => map.set(doc.id, {id: doc.id, ...doc.data() } as any));
  return map;
}
