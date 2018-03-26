import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.scss']
})
export class RaffleComponent implements OnInit {

  items = this.storage.raffleItemsChanges;

  constructor(
    app: AppComponent,
    private storage: Storage
  ) {
    app.setPageTitle('Raffle');
  }

  ngOnInit() {
  }

}
