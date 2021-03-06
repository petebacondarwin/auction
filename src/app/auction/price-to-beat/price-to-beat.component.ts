import { Component, Input } from '@angular/core';
import { Item } from 'app/models';

@Component({
  selector: 'app-price-to-beat',
  templateUrl: './price-to-beat.component.html',
  styleUrls: ['./price-to-beat.component.css']
})
export class PriceToBeatComponent {
  @Input()
  item: Item;

  get priceToBeat() {
    const lowestWinningBid = this.item.bidInfo.winningBids[this.item.quantity - 1];
    return lowestWinningBid ? lowestWinningBid.amount : 0;
  }
}
