import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
  categoriesCol: AngularFirestoreCollection<Category>;
  categories: Observable<Category[]>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.categoriesCol = this.afs.collection('categories');
    this.categories = this.categoriesCol.valueChanges();
  }
}
