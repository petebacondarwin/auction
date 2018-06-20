import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Bid, Item, UserInfo } from 'app/models';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-bid-report',
  templateUrl: './bid-report.component.html',
  styleUrls: ['./bid-report.component.scss']
})
export class BidReportComponent {

  rows = combineLatest(
    this.route.queryParamMap,
    this.storage.getBidReport(),
    (_params, items) => items
  );

  constructor(private storage: Storage, private route: ActivatedRoute) {}

  firstBidRow(rows: (Bid&Item&UserInfo&{bidCount: number, winningCount: number})[], index: number) {
    return index === 0 || rows[index].lot !== rows[index - 1].lot;
  }
}

