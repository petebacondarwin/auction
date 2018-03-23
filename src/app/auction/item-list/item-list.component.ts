import { Component, Input } from '@angular/core';

import { Category, Item } from 'app/models';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

  @Input()
  items: Item[];

  @Input()
  current: Item;

  @Input()
  category: Category;
}
