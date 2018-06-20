import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { empty } from 'rxjs/observable/empty';
import { switchMap, filter, map } from 'rxjs/operators';

import { Item, Bid, UserBidding, UserInfo } from 'app/models';
import { UserService } from 'app/auth/user.service';
import { Destroyable } from 'app/destroyable';
import { BidDialogComponent } from 'app/auction/bid-dialog/bid-dialog.component';

@Component({
  selector: 'app-bid-info',
  templateUrl: './bid-info.component.html',
  styleUrls: ['./bid-info.component.css']
})
export class BidInfoComponent extends Destroyable implements OnInit {
  @Input()
  item: Item;

  @Input()
  userBids: UserBidding[];

  @Output()
  bid = new EventEmitter<Bid>();

  isWinning = false;
  isLosing = false;

  sendingBid = false;

  constructor(
    private user: UserService,
    private dialog: MatDialog) {
      super();
    }

  ngOnInit() {
    this.isWinning = this.userBids && this.userBids.some(userBid => userBid.winning);
    this.isLosing = this.userBids && this.userBids.length && !this.isWinning;
  }

  bidNow() {
    this.user.ensureLoggedIn('Please login to bid for this item').pipe(
      filter(userInfo => !!userInfo),
      switchMap(userInfo =>
        this.showBidDialog(userInfo).pipe(
          map(bidAmount => ({bidAmount, userInfo})),
        )
      )
    ).subscribe(
      ({bidAmount, userInfo}) => {
        if (bidAmount) {
          console.log(`bid on ${this.item.title} of £${bidAmount}`);
          this.updateBidItem(bidAmount);
          this.emitBid(userInfo, bidAmount);
          this.sendingBid = true;
        }
      },
      error => console.log('error', error),
      () => console.log('complete')
    );
  }

  private showBidDialog(userInfo: UserInfo) {
    if (userInfo) {
      const options = { data: { item: this.item, userInfo } };
      const bidDialog: MatDialogRef<BidDialogComponent, number> = this.dialog.open(BidDialogComponent, options);
      return bidDialog.afterClosed();
    } else {
      return empty();
    }
  }

  private updateBidItem(bidAmount: number) {
    // temporarily update the local bid info to look like the bid had been made
    // the cloud functions will do this "officially" shortly after and then the
    // items list will update automatically.
    this.item.bidInfo.bidCount++;
    const winningBids = this.item.bidInfo.winningBids;
    winningBids.pop();
    winningBids.push({bid: '__temp-bid-id__', amount: bidAmount});
    winningBids.sort((a, b) => b.amount - a.amount);
  }

  private emitBid(userInfo: UserInfo, bidAmount: number) {
    this.bid.emit({
      bidder: userInfo.user.uid,
      item: this.item.id,
      amount: bidAmount,
      timestamp: new Date()
    });
  }
}
