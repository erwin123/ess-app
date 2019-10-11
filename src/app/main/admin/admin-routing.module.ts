import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from 'src/app/services/authguard.service';
import { SetLocationComponent } from './set-location/set-location.component';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';
import { MaintainEmployeeComponent } from './maintain-employee/maintain-employee.component';
import { SetAccountComponent } from './set-account/set-account.component';
import { DailyAbsenceComponent } from './daily-absence/daily-absence.component';
import { MaintainAbsenceComponent } from './maintain-absence/maintain-absence.component';

const routes: Routes = [
  {
    path: 'set-location',
    component: SetLocationComponent,
    data: { state: 'set-location' },
    canActivate:[AuthguardService]
  },
  {
    path: 'set-acc',
    component: SetAccountComponent,
    data: { state: 'set-acc' },
    canActivate:[AuthguardService]
  },
  {
    path: 'set-absence',
    component: DailyAbsenceComponent,
    data: { state: 'set-absence' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-location',
    component: MaintainLocationComponent,
    data: { state: 'maintain-location' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-employee',
    component: MaintainEmployeeComponent,
    data: { state: 'maintain-employee' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-absence',
    component: MaintainAbsenceComponent,
    data: { state: 'maintain-absence' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
