import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeAbsentRoutingModule } from './employee-absent-routing.module';
import { CreateAbsentComponent } from './create-absent/create-absent.component';

@NgModule({
  declarations: [CreateAbsentComponent],
  imports: [
    CommonModule,
    EmployeeAbsentRoutingModule
  ]
})
export class EmployeeAbsentModule { }
