import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Item } from 'app/models';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.css']
})
export class BidDialogComponent {

  bidForm = new FormGroup({
    amount: new FormControl((this.item.bidInfo.winningBids[0] || 0) + 1, [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public item: Item) { }

  submitBid() {}
  cancel() {}
}
