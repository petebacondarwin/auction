import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Item, BidInfo } from 'app/models';
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

  constructor(private dialog: MatDialog) {}

  bidNow() {
    this.dialog.open(BidDialogComponent, { data: this.item }).afterClosed().subscribe(this.bid);
  }
}
