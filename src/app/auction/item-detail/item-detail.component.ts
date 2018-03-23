import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

import { Storage } from 'app/storage.service';
import { Item } from 'app/models';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent {

  currentCategory = this.route.params.pipe(
    map(params => params['category'])
  );

  currentItemChanges = this.route.params.pipe(
    map(params => params['item'])
  );

  itemChanges = this.currentItemChanges.pipe(
    switchMap(item => this.storage.getAuctionItem(item))
  );

  constructor(private route: ActivatedRoute, private storage: Storage) {}
}
