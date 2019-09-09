import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeAbsentRoutingModule } from './employee-absent-routing.module';
import { CreateAbsentComponent } from './create-absent/create-absent.component';
import { SetLocationComponent } from './set-location/set-location.component';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';

@NgModule({
  declarations: [CreateAbsentComponent, SetLocationComponent],
  imports: [
    CommonModule,
    EmployeeAbsentRoutingModule,
    SharingModuleModule
  ]
})
export class EmployeeAbsentModule { }
