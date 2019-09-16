import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAbsentComponent } from './absent/create-absent/create-absent.component';
import { AuthguardService } from 'src/app/services/authguard.service';
import { HistoryAbsentComponent } from './absent/history-absent/history-absent.component';
import { ProfilComponent } from './profil/profil.component';

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
    path: 'profile',
    component: ProfilComponent,
    data: { state: 'profile' },
    canActivate:[AuthguardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegUserRoutingModule { }
