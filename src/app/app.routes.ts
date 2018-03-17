import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from 'app/app.component';
import { HomeComponent } from 'app/home/home.component';
import { AuctionComponent } from 'app/auction/auction.component';
import { MagicBoxComponent } from 'app/magic-box/magic-box.component';
import { RaffleComponent } from 'app/raffle/raffle.component';

import { LoginComponent } from 'app/auth/login/login.component';
import { AdminComponent } from 'app/admin/admin.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { SignupComponent } from 'app/auth/signup/signup.component';
import { EmailComponent } from 'app/auth/email/email.component';

export const router: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },

    { path: 'auction', component: AuctionComponent },
    { path: 'magic-box', component: MagicBoxComponent },
    { path: 'raffle', component: RaffleComponent },

    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);