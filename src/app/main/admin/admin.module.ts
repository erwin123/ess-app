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
import { MaintainDivisiComponent } from './maintain-divisi/maintain-divisi.component';
import { MaintainDepartmentComponent } from './maintain-department/maintain-department.component';
import { SetDepartmentComponent } from './set-department/set-department.component';
import { SetDivisiComponent } from './set-divisi/set-divisi.component';
import { MaintainHolidayComponent } from './maintain-holiday/maintain-holiday.component';
import { SetHolidayComponent } from './set-holiday/set-holiday.component';
import { MaintainWorkLocationComponent } from './maintain-work-location/maintain-work-location.component';
import { SetWorkLocationComponent } from './set-work-location/set-work-location.component';
import { MaintainShiftComponent } from './maintain-shift/maintain-shift.component';
import { SetShiftComponent } from './set-shift/set-shift.component';

@NgModule({
  declarations: [SetLocationComponent, MaintainLocationComponent,
    SetAccountComponent, MaintainEmployeeComponent,
    DailyAbsenceComponent, MaintainAbsenceComponent, SetMasterCutiComponent, MaintainCutiComponent, MaintainClaimComponent, SetMasterClaimComponent, MasterApprovalComponent, SetMasterApprovalComponent, MaintainApprovalComponent, MaintainDivisiComponent, MaintainDepartmentComponent, SetDepartmentComponent, SetDivisiComponent, MaintainHolidayComponent, SetHolidayComponent, MaintainWorkLocationComponent, SetWorkLocationComponent, MaintainShiftComponent, SetShiftComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModuleModule
  ],

})
export class AdminModule { }
