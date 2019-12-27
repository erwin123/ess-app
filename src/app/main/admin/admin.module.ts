import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SetLocationComponent } from './set-location/set-location.component';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';
import { SetAccountComponent } from './set-account/set-account.component';
import { MaintainEmployeeComponent } from './maintain-employee/maintain-employee.component';
import { DailyAbsenceComponent } from './daily-absence/daily-absence.component';
import { MaintainAbsenceComponent } from './maintain-absence/maintain-absence.component';
import { SetMasterCutiComponent } from './set-master-cuti/cuti.component';
import { MaintainCutiComponent } from './maintain-cuti/maintain-cuti.component';
import { MaintainClaimComponent } from './maintain-claim/maintain-claim.component';
import { SetMasterClaimComponent } from './set-master-claim/claim.component';
import { MasterApprovalComponent } from './master-approval/master-approval.component';
import { SetMasterApprovalComponent } from './set-master-approval/set-master-approval.component';
import { MaintainApprovalComponent } from './maintain-approval/maintain-approval.component';

@NgModule({
  declarations: [SetLocationComponent, MaintainLocationComponent,
    SetAccountComponent, MaintainEmployeeComponent,
    DailyAbsenceComponent, MaintainAbsenceComponent, SetMasterCutiComponent, MaintainCutiComponent, MaintainClaimComponent, SetMasterClaimComponent, MasterApprovalComponent, SetMasterApprovalComponent, MaintainApprovalComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModuleModule
  ],

})
export class AdminModule { }
