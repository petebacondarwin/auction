import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AngularFireAuth } from 'angularfire2/auth';

// import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
// import { Observable } from 'rxjs/Observable';

interface Category {
  name: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  user = this.afAuth.authState;
  // categoriesCol: AngularFirestoreCollection<Category>;
  // categories: Observable<Category[]>;
  readonly currentYear = new Date().getFullYear();

  private pageTitle: string;


  constructor(
    private titleService: Title,
    // private afs: AngularFirestore,
    private afAuth: AngularFireAuth) {}

  ngOnInit() {
    // this.categoriesCol = this.afs.collection('categories');
    // this.categories = this.categoriesCol.valueChanges();
  }

  setPageTitle(title: string) {
    this.titleService.setTitle(`Coleridge Summer Fair ${this.currentYear} - ${title}`);
  }
}
