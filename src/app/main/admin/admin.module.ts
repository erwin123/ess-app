import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SetLocationComponent } from './set-location/set-location.component';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';

@NgModule({
  declarations: [SetLocationComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModuleModule
  ],
  
})
export class AdminModule { }
