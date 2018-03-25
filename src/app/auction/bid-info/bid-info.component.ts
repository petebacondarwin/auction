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

  @Output()
  bid = new EventEmitter<Bid>();

  constructor(private auth: Auth, private dialog: MatDialog) {}

  async bidNow() {
    await this.auth.login('Please login to bid for this item');

    const bidDialog = this.dialog.open(BidDialogComponent, { data: this.item });
    bidDialog.afterClosed().subscribe(bidAmount => {
      if (bidAmount) {
        console.log(`bid on ${this.item.title} of £${bidAmount}`);

        this.bid.emit({
          bidder: this.auth.user.uid,
          item: this.item.id,
          amount: bidAmount
        });
      }
    });
  }
}
