import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-maintain-holiday',
  templateUrl: './maintain-holiday.component.html',
  styleUrls: ['./maintain-holiday.component.scss']
})
export class MaintainHolidayComponent implements OnInit {
  data = [];
  columns = [
    { key: 'Holidate', title: 'Tanggal' },
    { key: 'Description', title: 'Hari raya' }
  ];
  constructor(private stateService: StateService, private masterService: MasterService, private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getHoliday(crit).subscribe(dt => {
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-holiday'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent(data) {
    this.router.navigate(['main/admin/set-holiday/']);
  }
}
