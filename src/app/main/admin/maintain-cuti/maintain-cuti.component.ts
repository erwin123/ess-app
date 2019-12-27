import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-maintain-cuti',
  templateUrl: './maintain-cuti.component.html',
  styleUrls: ['./maintain-cuti.component.scss']
})
export class MaintainCutiComponent implements OnInit {
  data = [];
  columns = [
    { key: 'Type', title: 'Tipe' },
    { key: 'Description', title: 'Deskripsi' },
    { key: 'City', title: 'Kota' },
    { key: 'Quota', title: 'Quota' }
  ];
  constructor(private stateService: StateService,private masterService: MasterService, private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getCuti(crit).subscribe(dt => {
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-master-cuti'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent(data) {
    this.router.navigate(['main/admin/set-master-cuti/']);
  }
}
