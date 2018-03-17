import { Component } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Category } from 'app/models';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent {

  categories: Observable<Category[]>;

  constructor(
    app: AppComponent,
    afs: AngularFirestore,
  ) {
    app.setPageTitle('Auction');
    const categoriesCol = afs.collection<Category>('categories');
    this.categories = categoriesCol.valueChanges();
  }

  filter(category: Category) {
    console.log(category);
  }
}
