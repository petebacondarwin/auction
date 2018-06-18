import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Item, Bid, UserBidding } from 'app/models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
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

  @Input()
  biddingOpen: boolean;

  @Input()
  isWide: boolean;

  @Output()
  bid = new EventEmitter<Bid>();

  @Output()
  select = new EventEmitter<{category?: Category, item: Item}>();


  headerHeight() {
    return this.isWide ? '100px' : '150px';
  }

  getUserBids(item: Item) {
    return this.userBids && this.userBids.filter(bidding => bidding.item.id === item.id);
  }

  onSelect(item: Item) {
    this.select.emit({category: this.category, item});
  }

}
