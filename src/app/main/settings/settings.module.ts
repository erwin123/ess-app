import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';


@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharingModuleModule
  ]
})
export class SettingsModule { }
