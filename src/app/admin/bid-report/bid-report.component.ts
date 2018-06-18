import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { BidWithUser } from 'app/models';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-bid-report',
  templateUrl: './bid-report.component.html',
  styleUrls: ['./bid-report.component.scss']
})
export class BidReportComponent {

  rows = combineLatest(
    this.route.queryParamMap,
    this.storage.getBidReport(),
    (params, items) => items.reduce((previousRows, itemInfo) => {
      // flatten the winning bids giving only the first bid the item info
      const winningBids = itemInfo.winningBids.map((bid, index) => ({
        item: itemInfo.item,
        bid,
        bidValue: getBidValue(itemInfo.winningBids),
        winningBids: itemInfo.winningBids
      }));
      return previousRows.concat(winningBids.length ? winningBids : [{ item: itemInfo.item, bid: null, bidValue: 0, winningBids: [] }]);
    }, [])
  );

  constructor(private storage: Storage, private route: ActivatedRoute) {
    this.rows.subscribe(rows => console.log(rows));
  }

  firstBidRow(rows: any[], index: number) {
    return index === 0 || rows[index].item.lot !== rows[index - 1].item.lot;
  }

  visibility(value: boolean) {
    return value ? 'visible' : 'hidden';
  }
}

function getBidValue(bids: BidWithUser[]) {
  return bids.reduce((current, bid) => Math.max(current, bid.bid.amount), 0);
}
