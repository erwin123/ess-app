import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegUserRoutingModule } from './reg-user-routing.module';
import { CreateAbsentComponent } from './absent/create-absent/create-absent.component';
import { WebcamModule } from 'ngx-webcam';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';
import { HistoryAbsentComponent } from './absent/history-absent/history-absent.component';
import { EditAbsentComponent } from './absent/edit-absent/edit-absent.component';
import { ProfilComponent } from './profil/profil.component';

@NgModule({
  declarations: [CreateAbsentComponent, HistoryAbsentComponent, EditAbsentComponent, ProfilComponent],
  imports: [
    CommonModule,
    RegUserRoutingModule,
    WebcamModule,
    SharingModuleModule
  ],
  exports: [EditAbsentComponent],
  entryComponents:[EditAbsentComponent]
})
export class RegUserModule { }
