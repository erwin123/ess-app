import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';
@Component({
  selector: 'app-maintain-claim',
  templateUrl: './maintain-claim.component.html',
  styleUrls: ['./maintain-claim.component.scss']
})
export class MaintainClaimComponent implements OnInit {
  data = [];
  columns = [
    { key: 'Type', title: 'Tipe' },
    { key: 'Description', title: 'Deskripsi' },
    { key: 'Amount', title: 'Jumlah' },
    { key: 'ValidFrom', title: 'Tanggal Awal' },
    { key: 'ValidTo', title: 'Tanggal Akhir' }
  ];
  constructor(private stateService: StateService, private masterService: MasterService, private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getClaim(crit).subscribe(dt => {
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-master-claim'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent() {
    this.router.navigate(['main/admin/set-master-claim/']);
  }
}
