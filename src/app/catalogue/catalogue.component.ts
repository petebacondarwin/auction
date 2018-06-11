import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Item } from 'app/models';
import { Destroyable } from 'app/destroyable';
import { Storage } from 'app/storage.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent extends Destroyable implements OnInit {

  items: Observable<Item[]>;

  constructor(
    private storage: Storage,
  ) {
    super();
   }

  ngOnInit() {
    this.items = this.storage.auctionItemsChanges;
  }
}
