import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.scss']
})
export class RaffleComponent implements OnInit {

  constructor(app: AppComponent) {
    app.setPageTitle('Raffle');
  }

  ngOnInit() {
  }

}
