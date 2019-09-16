import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from 'src/app/services/authguard.service';
import { SetLocationComponent } from './set-location/set-location.component';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';

const routes: Routes = [
  {
    path: 'set-location',
    component: SetLocationComponent,
    data: { state: 'set-location' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-location',
    component: MaintainLocationComponent,
    data: { state: 'maintain-location' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
