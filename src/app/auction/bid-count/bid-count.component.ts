import { Component, Input } from '@angular/core';
import { BidInfo } from 'app/models';

@Component({
  selector: 'app-bid-count',
  templateUrl: './bid-count.component.html',
  styleUrls: ['./bid-count.component.css']
})
export class BidCountComponent {
  @Input()
  bidInfo: BidInfo;
}
