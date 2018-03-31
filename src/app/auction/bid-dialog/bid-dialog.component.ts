import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Item, UserInfo } from 'app/models';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.css']
})
export class BidDialogComponent {
  item = this.data.item;
  userInfo = this.data.userInfo;
  bidAmount: number;

  lowestWinningBid = this.item.bidInfo.winningBids[this.item.quantity - 1];
  minBid = (this.lowestWinningBid ? this.lowestWinningBid.amount : 0) + 1;
  suggestedBid = Math.max((this.item.showValue && this.item.value), this.minBid);
  bidForm = new FormGroup({
    amount: new FormControl(this.suggestedBid, [Validators.required, Validators.min(this.minBid)]),
  });

  constructor(
    private dialog: MatDialogRef<BidDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { item: Item, userInfo: UserInfo}
  ) {
  }

  submitBid() {
    this.dialog.close(this.bidForm.get('amount').value);
  }
}
