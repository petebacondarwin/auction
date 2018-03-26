import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { first, switchMap } from 'rxjs/operators';

import { Item } from 'app/models';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.css']
})
export class BidDialogComponent {

  minBid = (this.item.bidInfo.winningBids[this.item.quantity - 1] || 0) + 1;
  suggestedBid = (this.item.showValue && this.item.value) || this.minBid;
  bidForm = new FormGroup({
    amount: new FormControl(this.suggestedBid, [Validators.required, Validators.min(this.minBid)]),
  });

  constructor(private dialog: MatDialogRef<BidDialogComponent, number>, @Inject(MAT_DIALOG_DATA) public item: Item) {}

  submitBid() {
    return this.dialog.close(this.bidForm.get('amount').value);
  }
}
