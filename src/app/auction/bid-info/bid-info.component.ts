import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Item, BidInfo, Bid } from 'app/models';
import { Auth } from 'app/auth/auth.service';
import { BidDialogComponent } from 'app/auction/bid-dialog/bid-dialog.component';

@Component({
  selector: 'app-bid-info',
  templateUrl: './bid-info.component.html',
  styleUrls: ['./bid-info.component.css']
})
export class BidInfoComponent {
  @Input()
  item: Item;

  @Input()
  userBids: Bid[];

  @Output()
  bid = new EventEmitter<Bid>();

  constructor(private auth: Auth, private dialog: MatDialog) {}

  async bidNow() {
    const result = await this.auth.login('Please login to bid for this item');

    if (!result) {
      return;
    }

    const bidDialog = this.dialog.open(BidDialogComponent, { data: this.item });
    bidDialog.afterClosed().subscribe(bidAmount => {
      if (bidAmount) {
        console.log(`bid on ${this.item.title} of £${bidAmount}`);

        // temporarily update the local bid info to look like the bid had been made
        // the cloud functions will do this "officially" shortly after and then the
        // items list will update automatically.
        this.item.bidInfo.bidCount++;
        const winningBids = this.item.bidInfo.winningBids;
        winningBids.pop();
        winningBids.push({bid: '__temp-bid-id__', amount: bidAmount});
        winningBids.sort((a, b) => b.amount - a.amount);

        this.bid.emit({
          bidder: this.auth.user.uid,
          item: this.item.id,
          amount: bidAmount
        });
      }
    });
  }
}
