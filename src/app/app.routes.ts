import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from 'app/home/home.component';
import { AuctionComponent } from 'app/auction/auction.component';
import { MagicBoxComponent } from 'app/magic-box/magic-box.component';
import { RaffleComponent } from 'app/raffle/raffle.component';

import { AdminComponent } from 'app/admin/admin.component';
import { ProfileComponent } from 'app/profile/profile.component';
import { AdminGuard, AuthGuard } from 'app/auth/auth.guard';

export const router: Routes = [
  { path: '', component: HomeComponent },

  { path: 'auction', component: AuctionComponent },
  { path: 'magic-box', component: MagicBoxComponent },
  { path: 'raffle', component: RaffleComponent },

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
