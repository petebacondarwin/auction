import { Component, Input } from '@angular/core';
import { BidInfo } from 'app/models';

@Component({
  selector: 'app-price-to-beat',
  templateUrl: './price-to-beat.component.html',
  styleUrls: ['./price-to-beat.component.css']
})
export class PriceToBeatComponent {
  @Input()
  bidInfo: BidInfo;
}
