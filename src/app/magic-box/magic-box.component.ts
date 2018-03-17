import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';

@Component({
  selector: 'app-magic-box',
  templateUrl: './magic-box.component.html',
  styleUrls: ['./magic-box.component.css']
})
export class MagicBoxComponent implements OnInit {

  constructor(app: AppComponent) {
    app.setPageTitle('Magic Box');
  }

  ngOnInit() {
  }

}
