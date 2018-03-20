import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

import { Storage } from 'app/storage.service';
import { Item } from 'app/models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

  currentCategory = this.route.params.pipe(
    map(params => params['category'])
  );

  items = this.currentCategory.pipe(
    switchMap(category => this.storage.getAuctionItemsByCategory(category))
  );

  constructor(private route: ActivatedRoute, private storage: Storage) {}
}
