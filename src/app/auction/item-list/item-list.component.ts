import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Category, Item, Bid, UserBidding } from 'app/models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent {
  @Input()
  items: Item[];

  @Input()
  current: Item;

  @Input()
  userBids: UserBidding[];

  @Input()
  category: Category;

  @Output()
  bid = new EventEmitter<Bid>();

  getUserBids(item: Item) {
    return this.userBids && this.userBids.filter(bidding => bidding.item.id === item.id);
  }
}
