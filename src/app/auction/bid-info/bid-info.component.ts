import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Item, BidInfo } from 'app/models';
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
  bid = new EventEmitter();

  constructor(private auth: Auth, private dialog: MatDialog) {}

  async bidNow() {
    await this.auth.login('Please login to bid for this item');

    const bidDialog = this.dialog.open(BidDialogComponent, { data: this.item });
    bidDialog.afterClosed().subscribe((bidAmount: number|undefined) => {
      console.log(bidAmount);
    });
  }
}
