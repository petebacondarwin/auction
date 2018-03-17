import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HomeComponent } from 'app/home/home.component';
import { LoginComponent } from 'app/auth/login/login.component';
import { EmailComponent } from 'app/auth/email/email.component';
import { SignupComponent } from 'app/auth/signup/signup.component';
import { AdminComponent } from 'app/admin/admin.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { routes } from 'app/app.routes';
import { AppComponent } from 'app/app.component';
import { RaffleComponent } from './raffle/raffle.component';
import { AuctionComponent } from './auction/auction.component';
import { MagicBoxComponent } from './magic-box/magic-box.component';

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
    AppComponent,
    HomeComponent,
    LoginComponent,
    EmailComponent,
    SignupComponent,
    AdminComponent,
    RaffleComponent,
    AuctionComponent,
    MagicBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    routes
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
