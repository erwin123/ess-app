import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyDividerModule } from '@alyle/ui/divider';
import { LyExpansionIconModule } from '@alyle/ui';
import { LyExpansionModule } from '@alyle/ui/expansion';
import { RegUserRoutingModule } from './reg-user-routing.module';
import { CreateAbsentComponent } from './absent/create-absent/create-absent.component';
import { WebcamModule } from 'ngx-webcam';
import { SharingModuleModule } from 'src/app/sharing-module/sharing-module.module';
import { HistoryAbsentComponent } from './absent/history-absent/history-absent.component';
import { EditAbsentComponent } from './absent/edit-absent/edit-absent.component';
import { MyLocationComponent } from './absent/my-location/my-location.component';
import { ProfileItemsComponent } from './profil/profile-items/profile-items.component';
import { ProfileItemsFieldComponent } from './profil/profile-items-field/profile-items-field.component';
import { ProfilMainComponent } from './profil/profil-main/profil-main.component';
import { ProfilMainFieldComponent } from './profil/profil-main-field/profil-main-field.component';
import { KlaimComponent } from './klaim/klaim.component';
import { SuratTugasComponent } from './surat-tugas/surat-tugas.component';
import { MaintainSuratTugasComponent } from './maintain-surat-tugas/maintain-surat-tugas.component';
import { MaintainKlaimComponent } from './maintain-klaim/maintain-klaim.component';
import { MaintainCutiComponent } from './maintain-cuti/maintain-cuti.component';
import { IsiCutiComponent } from './isi-cuti/isi-cuti.component';
import { CreateAbsentLemburComponent } from './absent/create-absent-lembur/create-absent-lembur.component';
import { EditAbsentLemburComponent } from './absent/edit-absent-lembur/edit-absent-lembur.component';
import { HistoryAbsentLemburComponent } from './absent/history-absent-lembur/history-absent-lembur.component';
@NgModule({
  declarations: [CreateAbsentComponent,
    ProfileItemsComponent,
    HistoryAbsentComponent, 
    EditAbsentComponent, EditAbsentLemburComponent,
    MyLocationComponent, 
    ProfileItemsFieldComponent, 
    ProfilMainComponent, 
    ProfilMainFieldComponent, KlaimComponent, SuratTugasComponent, MaintainSuratTugasComponent, MaintainKlaimComponent, MaintainCutiComponent, IsiCutiComponent, CreateAbsentLemburComponent, EditAbsentLemburComponent, HistoryAbsentLemburComponent],
  imports: [
    CommonModule,
    RegUserRoutingModule,
    WebcamModule,
    SharingModuleModule,
    LyDividerModule,
    LyExpansionIconModule,
    LyExpansionModule
  ],
  exports: [EditAbsentComponent,EditAbsentLemburComponent,
    MyLocationComponent,
    ProfileItemsComponent,
    ProfileItemsFieldComponent,
    ProfilMainFieldComponent],
  entryComponents:[EditAbsentComponent,EditAbsentLemburComponent,
    MyLocationComponent,
    ProfileItemsComponent,
    ProfileItemsFieldComponent,
    ProfilMainFieldComponent]
})
export class RegUserModule { }
