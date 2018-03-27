import { Event, firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from './email';

let db: FirebaseFirestore.Firestore;

interface Bid {
  id: string;
  user: string;
  item: string;
  amount: number;
}

interface Item {
  lot: string;
  title: string;
  shortDescription: string;
  quantity: number;
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
    console.log(`change to ${action.params['itemId']}: updating ${category} to ${itemCount}`);
    return await db.doc(`categories/${category}`).update('itemCount', itemCount);
  });

export const bidEntered = firestore.document('bids/{bidId}')
  .onWrite(async (action: Event<firestore.DeltaDocumentSnapshot>) => {
    db = db || admin.firestore();
    const userId = action.data.get('user');
    const user = await admin.auth().getUser(userId);
    const userInfo = (await db.collection('users').doc(userId).get()).data() as UserInfo;
    const bid: Bid = action.data.data();
    const item = (await db.collection('auction-items').doc(bid.item).get()).data() as Item;
    const bids = (await db.collection('bids')
                          .where('item', '==', bid.item)
                          .orderBy('amount', 'desc')
                          .orderBy('timestamp').get()).docs;
    const winningBids = bids.slice(0, item.quantity).map(b => b.data()) as Bid[];

    // Update the bidInfo for this item
    await db.collection('bid-info').doc(bid.item).set({
      winningBids: winningBids.map(b => b.amount),
      bidCount: bids.length
    });


    console.log('bid', bid);
    console.log('winning bids', winningBids);

    // Send emails to the bidder
    if (winningBids.some(b => b.id === bid.id)) {
      console.log('new bid is one of the winners');
      await sendBidEmail(user, userInfo, item, bid);
    } else {
      // In the unlikely situation where this bid was outbid just before it was received
      await sendOutBidEmail(user, userInfo, item, winningBids[winningBids.length-1], bid);
    }
  });


async function sendBidEmail(user: admin.auth.UserRecord, userInfo: UserInfo, item: Item, bid: Bid) {
  if (userInfo.notify) {
    return;
  }

  await sendEmail(user.email, 'Bid Successful', `
  <!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
      <title>Coleridge Summer Fair - Auction Bids</title>
    </head>
    <body>
    <p>We have just received a bid for the Coleridge Summer Fair auction from this email address.<br/><em>If this was not you, please contact us by email, <a href="mailto:auction@coleridge-summer-fair.org?subject=Concern over bid: [[$bid->id]]">auction@coleridge-summer-fair.org</a></em></p>
    <p><strong>Your Bid:</strong></p>
    <table style="border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top;">
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Bid Amount:</th>
        <td style="border: solid 1px black; padding: 2px"> &pound;${bid.amount}</td>
      </tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Lot No:</th>
        <td style="border: solid 1px black; padding: 2px">${item.lot}</td>
      </tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Item:</th>
        <td style="border: solid 1px black; padding: 2px">
          <strong><a href="http://coleridge-summer-fair.org/auction;${item.id}">${item.title}</a></strong><br/>
          ${item.shortDescription}
        </td>
      </tr>
    </table>
    <p><strong>Bidder Details: </strong></p>
    <table style="border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top;">
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Full name:</th>
        <td style="border: solid 1px black; padding: 2px">${user.displayName}</td></tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Email:</th>
        <td style="border: solid 1px black; padding: 2px">${user.email}</td></tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Phone:</th>
        <td style="border: solid 1px black; padding: 2px">${userInfo.phone}]]</td></tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Child info:</th>
        <td style="border: solid 1px black; padding: 2px">${userInfo.childDetails}</td></tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Email Me:</th>
        <td style="border: solid 1px black; padding: 2px">${userInfo.notify ? 'Yes' : 'No'}</td></tr>
    </table>
    <p><small>You are receiving this email because you ticked the "Notify me, by email, about my bids" checkbox when you submitted the bid.<br/>If you do not wish to receive further emails then please contact us by email, <a href="mailto:auction@coleridge-summer-fair.org?subject=Do not notify me">auction@coleridge-summer-fair.org</a> or phone, 07957157280</em></small></p>
    </body>
  </html>
  `);
}

async function sendOutBidEmail(user: admin.auth.UserRecord, userInfo: UserInfo, item: Item, newBid: Bid, oldBid: Bid) {
  if (userInfo.notify) {
    return;
  }

  await sendEmail(user.email, 'Outbid', `
  <!DOCTYPE html>
  <html lang="en-GB">
    <head>
      <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
      <title>Coleridge Summer Fair - Auction Bids</title>
    </head>
    <body>
    <p>
      You have just been out-bid on an item in the Coleridge Families Summer Fair.<br/>
      <strong><a href="http://coleridge-summer-fair.org/auction#?i=${item.id}">Click here to bid again.</a></strong>
    </p>
    <p><strong>Item:</strong></p>
    <table style="border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top;">
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Lot No:</th>
        <td style="border: solid 1px black; padding: 2px">${item.id}</td>
      </tr>
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Item:</th>
        <td style="border: solid 1px black; padding: 2px">
          <strong><a href="http://coleridge-summer-fair.org/auction${item.id}">${item.title}</a></strong><br/>
          ${item.shortDescription}
        </td>
      </tr>
    </table>
    <p><strong>New Winning Bid:</strong></p>
    <table style="border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top;">
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Bid Amount:</th>
        <td style="border: solid 1px black; padding: 2px"> &pound;${newBid.amount}</td>
      </tr>
    </table>
    <p><strong>Your Previous Bid:</strong></p>
    <table style="border-collapse: collapse; border: solid 1px black; text-align: left; vertical-align: top;">
      <tr style="text-align: left; vertical-align: top;">
        <th style="border: solid 1px black; padding: 2px">Bid Amount:</th>
        <td style="border: solid 1px black; padding: 2px"> &pound;${oldBid.amount}</td>
      </tr>
    </table>
    <p><small>You are receiving this email because you ticked the "Notify me, by email, about my bids" checkbox when you submitted the bid.<br/>If you do not wish to receive further emails then please contact us by email, <a href="mailto:auction@coleridge-summer-fair.org?subject=Do not notify me">auction@coleridge-summer-fair.org</a> or phone, 07957157280</em></small></p>
    </body>
  </html>
  `);
}