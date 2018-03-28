import { Component, OnInit } from '@angular/core';
import { switchMap, filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Auth } from 'app/auth/auth.service';
import { Bid, BidInfo, Item } from 'app/models';
import { Storage } from 'app/storage.service';


interface BiddingInfo {
  item: Item;
  bids: Bid[];
  winningBidIds: Set<string>;
}

interface ItemMap {
  [itemId: string]: BiddingInfo;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  bids = this.auth.userChanges.pipe(
    switchMap(user => this.storage.getBidsForUser(user && user.uid))
  );

  bidding = combineLatest(
    this.bids,
    this.storage.auctionItemsChanges,
    (bids, items) => {
      const itemMap: ItemMap = {};
      bids.forEach(bid => {
        const item = items.find(i => i.id === bid.item);
        // get (or create and store) the biddingInfo for this bid
        if (!itemMap[bid.item]) {
          itemMap[bid.item] = {
            item,
            bids: [],
            winningBidIds: new Set(item.bidInfo.winningBids.map(x => x.bid))
          };
        }
        itemMap[bid.item].bids.push(bid);
      });
      return Object.keys(itemMap).map(key => itemMap[key]);
    }
  );

  constructor(public auth: Auth, public storage: Storage) { }

  ngOnInit() {
  }

}
