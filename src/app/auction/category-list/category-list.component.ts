import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'app/models';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {

  @Input()
  categories: Category[];

  @Input()
  currentCategory: Category;

  @Output()
  select = new EventEmitter();

  onSelect(category: Category) {
    this.select.emit(category);
  }
}
