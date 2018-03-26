import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-magic-box',
  templateUrl: './magic-box.component.html',
  styleUrls: ['./magic-box.component.scss']
})
export class MagicBoxComponent implements OnInit {

  items = this.storage.magicBoxItemsChanges;

  constructor(
    app: AppComponent,
    private storage: Storage
  ) {
    app.setPageTitle('Magic Box');
  }

  ngOnInit() {
  }

}
