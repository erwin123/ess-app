import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AuthguardService } from './services/authguard.service';
import { LandingComponent } from './main/landing/landing.component';
import { InboxComponent } from './main/inbox/inbox.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { state: 'login' } },
  {
    path: 'main', component: MainComponent, canActivate: [AuthguardService],
    children: [
      { path: 'landing', component: LandingComponent, data: { state: 'landing' }},
      { path: 'inbox/:id', component: InboxComponent, data: { state: 'inbox' }},
      { path: 'inbox', component: InboxComponent, data: { state: 'inbox' }},
      {
        path: 'admin',
        loadChildren: './main/admin/admin.module#AdminModule',
        data: { state: 'admin' }
      },
      {
        path: 'reg-user',
        loadChildren: './main/reg-user/reg-user.module#RegUserModule',
        data: { state: 'reg-user' }
      },
      {
        path: 'settings',
        loadChildren: './main/settings/settings.module#SettingsModule',
        data: { state: 'admin' }
      },
    ]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'main/landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
