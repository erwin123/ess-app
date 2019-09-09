import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAbsentComponent } from './create-absent/create-absent.component';
import { AuthguardService } from 'src/app/services/authguard.service';
import { SetLocationComponent } from './set-location/set-location.component';

const routes: Routes = [
  {
    path: 'create-absent',
    component: CreateAbsentComponent,
    data: { state: 'create-absent' },
    canActivate:[AuthguardService]
  },
  {
    path: 'set-location',
    component: SetLocationComponent,
    data: { state: 'set-location' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAbsentRoutingModule { }
