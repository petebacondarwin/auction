import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutModule } from '@angular/cdk/layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HomeComponent } from 'app/home/home.component';
import { LoginComponent } from 'app/auth/login/login.component';
// import { SignupComponent } from 'app/auth/signup/signup.component';
import { AdminComponent } from 'app/admin/admin.component';
import { AppComponent } from 'app/app.component';
import { RaffleComponent } from './raffle/raffle.component';
import { AuctionComponent } from './auction/auction.component';
import { MagicBoxComponent } from './magic-box/magic-box.component';
import { HowItWorksComponent } from './auction/how-it-works/how-it-works.component';
import { CategoryListComponent } from './auction/category-list/category-list.component';
import { UserInfoComponent } from './auth/signup/user-info/user-info.component';
import { ItemListComponent } from './auction/item-list/item-list.component';
import { DonorComponent } from './auction/donor/donor.component';

import { ScrollIntoViewDirective } from './scrollIntoView.directive';

import { AdminGuard, AuthGuard } from 'app/auth/auth.guard';
import { Auth } from 'app/auth/auth.service';
import { Storage } from 'app/storage.service';
import { routes } from 'app/app.routes';
import { BidInfoComponent } from './auction/bid-info/bid-info.component';
import { BidDialogComponent } from './auction/bid-dialog/bid-dialog.component';
import { WinningBidsComponent } from './auction/winning-bids/winning-bids.component';
import { PriceToBeatComponent } from './auction/price-to-beat/price-to-beat.component';
import { BidCountComponent } from './auction/bid-count/bid-count.component';

const firebaseConfig = {
  apiKey: 'AIzaSyB9hEev-uMrgTQilyuHCtKcEUFMcVOFcpM',
  authDomain: 'coleridge-summer-fair.firebaseapp.com',
  databaseURL: 'https://coleridge-summer-fair.firebaseio.com',
  projectId: 'coleridge-summer-fair',
  storageBucket: 'coleridge-summer-fair.appspot.com',
  messagingSenderId: '1052904504519'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    // SignupComponent,
    AdminComponent,
    RaffleComponent,
    AuctionComponent,
    MagicBoxComponent,
    HowItWorksComponent,
    CategoryListComponent,
    UserInfoComponent,
    ItemListComponent,
    ScrollIntoViewDirective,
    DonorComponent,
    BidInfoComponent,
    BidDialogComponent,
    WinningBidsComponent,
    PriceToBeatComponent,
    BidCountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    routes
  ],
  entryComponents: [
    LoginComponent,
    BidDialogComponent
  ],
  providers: [
    AdminGuard,
    Auth,
    AuthGuard,
    Storage
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
