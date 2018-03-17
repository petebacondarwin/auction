import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from 'app/auth/login/login.component';
import { AdminComponent } from 'app/admin/admin.component';
import { AuthGuard } from 'app/auth/auth.guard';
import { SignupComponent } from 'app/auth/signup/signup.component';
import { EmailComponent } from 'app/auth/email/email.component';

export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login-email', component: EmailComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }

]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);