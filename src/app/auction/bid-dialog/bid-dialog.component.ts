import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { Item, UserInfo } from 'app/models';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.css']
})
export class BidDialogComponent {
  item: Item;
  userInfo: UserInfo;
  bidAmount: number;

  lowestWinningBid = this.item.bidInfo.winningBids[this.item.quantity - 1];
  minBid = (this.lowestWinningBid ? this.lowestWinningBid.amount : 0) + 1;
  suggestedBid = Math.max((this.item.showValue && this.item.value), this.minBid);
  bidForm = new FormGroup({
    amount: new FormControl(this.suggestedBid, [Validators.required, Validators.min(this.minBid)]),
  });

  constructor(private dialog: MatDialogRef<BidDialogComponent>) {}

  submitBid() {
    this.bidAmount = this.bidForm.get('amount').value;
    this.dialog.close();
  }
}
