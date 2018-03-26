import { Component, Input } from '@angular/core';
import { Item } from 'app/models';

@Component({
  selector: 'app-winning-bids',
  templateUrl: './winning-bids.component.html',
  styleUrls: ['./winning-bids.component.css']
})
export class WinningBidsComponent {
  @Input()
  item: Item;
}
