import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from 'app/app.component';
import { HomeComponent } from 'app/home/home.component';
import { AuctionComponent } from 'app/auction/auction.component';
import { ItemListComponent } from 'app/auction/item-list/item-list.component';
import { ItemDetailComponent } from 'app/auction/item-detail/item-detail.component';
import { MagicBoxComponent } from 'app/magic-box/magic-box.component';
import { RaffleComponent } from 'app/raffle/raffle.component';

import { LoginComponent } from 'app/auth/login/login.component';
import { AdminComponent } from 'app/admin/admin.component';
import { AdminGuard, AuthGuard } from 'app/auth/auth.guard';
import { SignupComponent } from 'app/auth/signup/signup.component';

export const router: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auction',
    component: AuctionComponent,
    children: [
      { path: '', component: ItemListComponent },
      { path: ':category', component: ItemListComponent },
      { path: ':category/:item', component: ItemDetailComponent }
    ]
  },
  { path: 'magic-box', component: MagicBoxComponent },
  { path: 'raffle', component: RaffleComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard, AuthGuard] }
]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);