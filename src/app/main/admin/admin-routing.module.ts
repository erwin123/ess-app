import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from 'src/app/services/authguard.service';
import { SetLocationComponent } from './set-location/set-location.component';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';
import { MaintainEmployeeComponent } from './maintain-employee/maintain-employee.component';
import { SetAccountComponent } from './set-account/set-account.component';
import { DailyAbsenceComponent } from './daily-absence/daily-absence.component';
import { MaintainAbsenceComponent } from './maintain-absence/maintain-absence.component';
import { SetMasterCutiComponent } from './set-master-cuti/cuti.component';
import { MaintainCutiComponent } from './maintain-cuti/maintain-cuti.component';
import { MaintainClaimComponent } from './maintain-claim/maintain-claim.component';
import { SetMasterClaimComponent } from './set-master-claim/claim.component';
import { SetMasterApprovalComponent } from './set-master-approval/set-master-approval.component';
import { MaintainApprovalComponent } from './maintain-approval/maintain-approval.component';

const routes: Routes = [
  {
    path: 'set-location',
    component: SetLocationComponent,
    data: { state: 'set-location' },
    canActivate: [AuthguardService]
  },
  {
    path: 'set-acc',
    component: SetAccountComponent,
    data: { state: 'set-acc' },
    canActivate: [AuthguardService]
  },
  {
    path: 'set-master-cuti',
    component: SetMasterCutiComponent,
    data: { state: 'set-cuti' },
    canActivate: [AuthguardService]
  },
  {
    path: 'set-master-claim',
    component: SetMasterClaimComponent,
    data: { state: 'set-claim' },
    canActivate: [AuthguardService]
  },
  {
    path: 'set-absence',
    component: DailyAbsenceComponent,
    data: { state: 'set-absence' },
    canActivate: [AuthguardService]
  },
  {
    path: 'set-master-approval',
    component: SetMasterApprovalComponent,
    data: { state: 'set-master-approval' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-location',
    component: MaintainLocationComponent,
    data: { state: 'maintain-location' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-employee',
    component: MaintainEmployeeComponent,
    data: { state: 'maintain-employee' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-absence',
    component: MaintainAbsenceComponent,
    data: { state: 'maintain-absence' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-masterapproval',
    component: MaintainApprovalComponent,
    data: { state: 'maintain-masterapproval' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-mastercuti',
    component: MaintainCutiComponent,
    data: { state: 'maintain-mastercuti' },
    canActivate: [AuthguardService]
  },
  {
    path: 'maintain-masterclaim',
    component: MaintainClaimComponent,
    data: { state: 'maintain-masterclaim' },
    canActivate: [AuthguardService]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
