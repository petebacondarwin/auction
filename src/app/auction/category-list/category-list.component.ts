import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from 'app/models';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnChanges {
  @Input()
  categories: Category[];
  @Input()
  current: Category;

  total = 0;

  ngOnChanges(changes: SimpleChanges) {
    const categoryChanges = changes['categories'];
    if (categoryChanges && categoryChanges.currentValue) {
      this.total = this.categories.reduce((count, category) => count + category.itemCount, 0);
    }
  }
}
