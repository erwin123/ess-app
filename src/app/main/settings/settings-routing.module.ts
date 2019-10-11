import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthguardService } from 'src/app/services/authguard.service';

const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { state: 'change-password' },
    canActivate:[AuthguardService]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
