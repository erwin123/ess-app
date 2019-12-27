import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAbsentComponent } from './absent/create-absent/create-absent.component';
import { AuthguardService } from 'src/app/services/authguard.service';
import { HistoryAbsentComponent } from './absent/history-absent/history-absent.component';
import { ProfilMainComponent } from './profil/profil-main/profil-main.component';
import { KlaimComponent } from './klaim/klaim.component';
import { SuratTugasComponent } from './surat-tugas/surat-tugas.component';
import { MaintainSuratTugasComponent } from './maintain-surat-tugas/maintain-surat-tugas.component';
import { MaintainKlaimComponent } from './maintain-klaim/maintain-klaim.component';
import { IsiCutiComponent } from './isi-cuti/isi-cuti.component';
import { MaintainCutiComponent } from './maintain-cuti/maintain-cuti.component';
import { HistoryAbsentLemburComponent } from './absent/history-absent-lembur/history-absent-lembur.component';
import { CreateAbsentLemburComponent } from './absent/create-absent-lembur/create-absent-lembur.component';

const routes: Routes = [
  {
    path: 'create-absent-in/:purpose',
    component: CreateAbsentComponent,
    data: { state: 'create-absent-in' },
    canActivate:[AuthguardService]
  },
  {
    path: 'create-absent-out/:purpose',
    component: CreateAbsentComponent,
    data: { state: 'create-absent-out' },
    canActivate:[AuthguardService]
  },
  {
    path: 'history-absent',
    component: HistoryAbsentComponent,
    data: { state: 'history-absent' },
    canActivate:[AuthguardService]
  },
  {
    path: 'create-absent-lembur-in/:purpose',
    component: CreateAbsentLemburComponent,
    data: { state: 'create-absent-lembur-in' },
    canActivate:[AuthguardService]
  },
  {
    path: 'create-absent-lembur-out/:purpose',
    component: CreateAbsentLemburComponent,
    data: { state: 'create-absent-lembur-out' },
    canActivate:[AuthguardService]
  },
  {
    path: 'history-absent-lembur',
    component: HistoryAbsentLemburComponent,
    data: { state: 'history-absent' },
    canActivate:[AuthguardService]
  },
  {
    path: 'profile-main/:emp',
    component: ProfilMainComponent,
    data: { state: 'profile-main' },
    canActivate:[AuthguardService]
  },
  {
    path: 'isi-klaim',
    component: KlaimComponent,
    data: { state: 'isi-klaim' },
    canActivate:[AuthguardService]
  },
  {
    path: 'isi-klaim',
    component: KlaimComponent,
    data: { state: 'isi-klaim' },
    canActivate:[AuthguardService]
  },
  {
    path: 'isi-cuti',
    component: IsiCutiComponent,
    data: { state: 'isi-cuti' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-cuti',
    component: MaintainCutiComponent,
    data: { state: 'maintain-cuti' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-klaim',
    component: MaintainKlaimComponent,
    data: { state: 'maintain-klaim' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-klaim/:reference',
    component: MaintainKlaimComponent,
    data: { state: 'maintain-klaim' },
    canActivate:[AuthguardService]
  },
  {
    path: 'isi-surat-tugas',
    component: SuratTugasComponent,
    data: { state: 'isi-surat-tugas' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-surat-tugas/:reference',
    component: MaintainSuratTugasComponent,
    data: { state: 'maintain-surat-tugas' },
    canActivate:[AuthguardService]
  },
  {
    path: 'maintain-surat-tugas',
    component: MaintainSuratTugasComponent,
    data: { state: 'maintain-surat-tugas' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegUserRoutingModule { }
