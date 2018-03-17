import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

  constructor(app: AppComponent) {
    app.setPageTitle('Auction');
  }

  ngOnInit() {
  }

}
