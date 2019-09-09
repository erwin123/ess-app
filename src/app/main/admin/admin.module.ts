import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SetLocationComponent } from './set-location/set-location.component';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';

@NgModule({
  declarations: [SetLocationComponent, MaintainLocationComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModuleModule
  ],
  
})
export class AdminModule { }
