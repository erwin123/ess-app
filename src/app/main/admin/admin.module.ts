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

@NgModule({
  declarations: [SetLocationComponent, MaintainLocationComponent,
    SetAccountComponent, MaintainEmployeeComponent,
    DailyAbsenceComponent, MaintainAbsenceComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModuleModule
  ],

})
export class AdminModule { }
