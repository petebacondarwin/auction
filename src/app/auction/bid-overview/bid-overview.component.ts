import { Component, Input, OnChanges } from '@angular/core';
import { Item } from 'app/models';

@Component({
  selector: 'app-bid-overview',
  templateUrl: './bid-overview.component.html',
  styleUrls: ['./bid-overview.component.scss']
})
export class BidOverviewComponent implements OnChanges {

  @Input()
  items: Item[];

  bidCount = 0;
  bidSum = 0;

  ngOnChanges() {
    if (this.items) {
      this.bidCount = 0;
      this.bidSum = 0;
      this.items.forEach(item => {
        if (item.bidInfo) {
          this.bidCount += item.bidInfo.bidCount;
          this.bidSum += item.bidInfo.winningBids.reduce((sum, bid) => sum + bid.amount, 0);
        }
      });
    }
  }
}
