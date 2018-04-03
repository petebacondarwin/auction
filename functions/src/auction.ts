import { Event, firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './email';

let db: FirebaseFirestore.Firestore;
let auth: admin.auth.Auth;

interface Bid {
  id: string;
  bidder: string;
  item: string;
  amount: number;
}

interface Item {
  id: string;
  lot: string;
  title: string;
  shortDescription?: string;
  longDescription: string;
  quantity: number;
}

interface WinningBid {
  bid: string;
  amount: number;
}

interface UserInfo {
  phone: string;
  roles?: {
    admin?: boolean;
  };
  childDetails: string;
  notify: boolean;
}

export const auctionItemAdded = firestore.document('auction-items/{itemId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    const category = action.data.get('category');
    db = db || admin.firestore();
    const itemsInCategory = await db.collection('auction-items').where('category', '==', category).get();
    const itemCount = itemsInCategory.size;
    const params = action.params || {}; // this is a hack to avoid a bug in tslint
    console.log(`change to ${params['itemId']}: updating ${category} to ${itemCount}`);
    return await db.doc(`categories/${category}`).update('itemCount', itemCount);
  });

export const bidEntered = firestore.document('bids/{bidId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    db = db || admin.firestore();
    auth = auth || admin.auth();
    const bid: Bid = action.data.data();
    console.log(bid);
    const userId = bid.bidder;
    const user = await auth.getUser(userId);
    const userInfo = await getUserInfo(userId);
    const item = await getItem(bid.item);

    const bidQuery = db.collection('bids')
                        .where('item', '==', bid.item)
                        .orderBy('amount', 'desc')
                        .orderBy('timestamp')
                        .select('amount');
    const bidCount = (await bidQuery.get()).size;
    const winningBidsSnapshot = await bidQuery.limit(item.quantity).get();
    const winningBids: WinningBid[] = winningBidsSnapshot.docs.map(b => ({ bid: b.id, amount: b.get('amount') }));

    // Update the bidInfo for this item
    await db.collection('bid-info').doc(bid.item).set({ winningBids, bidCount });
    await sendBidEmail(user, userInfo, item, bid);
  });

  export const bidInfoUpdated = firestore.document('bid-info/{bidInfoId}')
    .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
      db = db || admin.firestore();
      auth = auth || admin.auth();

      const newWinningBids: WinningBid[] = action.data.get('winningBids');
      const newWinningBidSet = new Set(newWinningBids.map(winningBid => winningBid.bid));
      const bidToBeatId = newWinningBids[newWinningBids.length - 1].bid;
      const bidToBeat = (await db.doc(`bids/${bidToBeatId}`).get()).data() as Bid;

      const oldWinningBids: WinningBid[] = action.data.previous.get('winningBids') || [];
      const oldWinningBidSet = new Set(oldWinningBids.map(winningBid => winningBid.bid));

      newWinningBidSet.forEach(bidId => oldWinningBidSet.delete(bidId));

      console.log(oldWinningBidSet);
      for(const bidId of oldWinningBidSet) {
        // email the bidder who was outbid
        const bid = (await db.doc(`bids/${bidId}`).get()).data() as Bid;
        const user = await auth.getUser(bid.bidder);
        const userInfo = await getUserInfo(bid.bidder);
        const item = await getItem(bid.item);
        console.log('Emailing ', user.email);
        await sendOutBidEmail(user, userInfo, item, bidToBeat, bid);
      }
    });

async function getUserInfo(userId: string) {
  db = db || admin.firestore();
  const userInfo = await db.collection('users').doc(userId).get();
  return (userInfo.data() || {}) as UserInfo;
}

async function getItem(itemId: string) {
  db = db || admin.firestore();
  const item = await db.collection('auction-items').doc(itemId).get();
  return item.data() as Item;
}

async function sendBidEmail(user: admin.auth.UserRecord, userInfo: UserInfo, item: Item, bid: Bid) {
  if (!userInfo.notify) {
    return;
  }

  console.log('Sending bid email to ', user.email);

  await sendEmail(user.email, `Bid Successful: ${item.lot} - ${item.title}`, `
  <!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
      <title>Coleridge Summer Fair - Auction Bids</title>
      <style>
        table {
          border-collapse: collapse;
          border: solid 1px black;
          text-align: left;
          vertical-align: top;
        }
        tr {
          text-align: left;
          vertical-align: top;
        }
        th, td {
          border: solid 1px black;
          padding: 2px
        }
      </style>
    </head>
    <body>
    <p>
      We have just received a bid for the Coleridge Summer Fair auction from this email address.<br/>
      <em>If this was not you, please contact us by email,
      <a href="mailto:auction@coleridge-summer-fair.org?subject=Concern over bid: ${bid.id}">auction@coleridge-summer-fair.org</a></em>
    </p>

    <p><strong>Your Bid:</strong></p>
    <table>
      <tr>
        <th>Bid Amount:</th>
        <td> &pound;${bid.amount}</td>
      </tr>
      <tr>
        <th>Lot No:</th>
        <td>${item.lot}</td>
      </tr>
      <tr>
        <th>Item:</th>
        <td>
          <strong><a href="http://coleridge-summer-fair.org/auction;${item.lot}">${item.title}</a></strong><br/>
          ${item.shortDescription || item.longDescription || ''}
        </td>
      </tr>
    </table>

    <p><strong>Bidder Details: </strong></p>
    <table>
      <tr>
        <th>Full name:</th>
        <td>${user.displayName}</td></tr>
      <tr>
        <th>Email:</th>
        <td>${user.email}</td></tr>
      <tr>
        <th>Phone:</th>
        <td>${userInfo.phone || '-- none provided --'}</td></tr>
      <tr>
        <th>Child info:</th>
        <td>${userInfo.childDetails || '-- none provided --'}</td></tr>
      <tr>
        <th>Email Me:</th>
        <td>${userInfo.notify ? 'Yes' : 'No'}</td></tr>
    </table>
    ${getFooter()}
    </body>
  </html>
  `);
}


async function sendOutBidEmail(user: admin.auth.UserRecord, userInfo: UserInfo, item: Item, bidToBeat: Bid, outBid: Bid) {
  if (!userInfo.notify) {
    return;
  }

  console.log('Sending outbid email to ', user.email);

  await sendEmail(user.email, `Outbid: ${item.lot} - ${item.title}`, `
  <!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
      <title>Coleridge Summer Fair - Auction Bids</title>
      <style>
        table {
          border-collapse: collapse;
          border: solid 1px black;
          text-align: left;
          vertical-align: top;
        }
        tr {
          text-align: left;
          vertical-align: top;
        }
        th, td {
          border: solid 1px black;
          padding: 2px
        }
      </style>
    </head>
    <body>
    <p>
      You have just been out-bid on an item in the Coleridge Families Summer Fair.<br/>
      <strong><a href="http://coleridge-summer-fair.org/auction;item=${item.lot}">Click here to bid again.</a></strong>
    </p>
    <p><strong>Item:</strong></p>
    <table>
      <tr>
        <th>Lot No:</th>
        <td>${item.lot}</td>
      </tr>
      <tr>
        <th>Item:</th>
        <td>
          <strong><a href="http://coleridge-summer-fair.org/auction;item=${item.lot}">${item.title}</a></strong><br/>
          ${item.shortDescription || item.longDescription || ''}
        </td>
      </tr>
    </table>
    <p><strong>Price to beat:</strong></p>
    <table>
      <tr>
        <th>Bid Amount:</th>
        <td>&pound;${bidToBeat.amount}</td>
      </tr>
    </table>
    <p><strong>Your Previous Bid:</strong></p>
    <table>
      <tr>
        <th>Bid Amount:</th>
        <td>&pound;${outBid.amount}</td>
      </tr>
    </table>
    ${getFooter()}
    </body>
  </html>
  `);
}

function getFooter() {
  return `
  <p>
  <small>
    You are receiving this email because you ticked the "Notify me, by email, about my bids" checkbox when you submitted the bid.<br/>
    If you do not wish to receive further emails then please <a href="https://coleridge-summer-fair.org/profile">update your profile</a>, contact us by email, <a href="mailto:auction@coleridge-summer-fair.org?subject=Do not notify me">auction@coleridge-summer-fair.org</a> or phone, 07957157280</em>
  </small>
  </p>
  `
}