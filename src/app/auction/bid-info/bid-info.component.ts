import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { switchMap, first, tap } from 'rxjs/operators';

import { Item, Bid, UserInfo } from 'app/models';
import { Login } from 'app/auth/login.service';
import { Storage } from 'app/storage.service';
import { Destroyable } from 'app/destroyable';
import { BidDialogComponent } from 'app/auction/bid-dialog/bid-dialog.component';

@Component({
  selector: 'app-bid-info',
  templateUrl: './bid-info.component.html',
  styleUrls: ['./bid-info.component.css']
})
export class BidInfoComponent extends Destroyable {
  @Input()
  item: Item;

  @Input()
  userBids: Bid[];

  @Output()
  bid = new EventEmitter<Bid>();

  constructor(
    private login: Login,
    private storage: Storage,
    private dialog: MatDialog) {
      super();
    }

  bidNow() {
    return this.login.ensureLoggedIn('Please login to bid for this item').pipe(
      switchMap(userInfo => this.showBidDialog(userInfo)),
      first(),
      tap(console.log.bind(console)),
      tap(dialog =>  {
        if (dialog) {
          const {userInfo, bidAmount} = dialog;
          console.log(`bid on ${this.item.title} of £${bidAmount}`);
          this.updateBidItem(bidAmount);
          this.emitBid(userInfo, bidAmount);
        }
      }),
      this.takeUntilDestroyed()
    ).subscribe(
      x => console.log('next', x),
      y => console.log('error', y),
      () => console.log('complete')
    );
  }

  private showBidDialog(userInfo: UserInfo) {
    if (userInfo) {
      const bidDialog = this.dialog.open(BidDialogComponent);
      return bidDialog.afterClosed().map(() => bidDialog.componentInstance);
    } else {
      return of<BidDialogComponent>(null);
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
      amount: bidAmount
    });
  }
}
