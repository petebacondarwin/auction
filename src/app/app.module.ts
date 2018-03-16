import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppComponent } from './app.component';

const firebaseConfig = {
  apiKey: "AIzaSyB9hEev-uMrgTQilyuHCtKcEUFMcVOFcpM",
  authDomain: "coleridge-summer-fair.firebaseapp.com",
  databaseURL: "https://coleridge-summer-fair.firebaseio.com",
  projectId: "coleridge-summer-fair",
  storageBucket: "coleridge-summer-fair.appspot.com",
  messagingSenderId: "1052904504519"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
