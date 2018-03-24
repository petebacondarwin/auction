import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { first, switchMap } from 'rxjs/operators';

import { Auth } from 'app/auth/auth.service';
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

  constructor(private auth: Auth, @Inject(MAT_DIALOG_DATA) public item: Item) { }

  submitBid() {
    return this.auth.login('Please login to make a bid.');
  }
}
