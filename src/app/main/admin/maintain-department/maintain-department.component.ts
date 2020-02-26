import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-maintain-department',
  templateUrl: './maintain-department.component.html',
  styleUrls: ['./maintain-department.component.scss']
})
export class MaintainDepartmentComponent implements OnInit {
  data = [];
  columns = [
    { key: 'Name', title: 'Nama' },
    { key: 'Initial', title: 'Inisial' },
    { key: 'Division.Name', title: 'Function' }
  ];
  constructor(private stateService: StateService, private masterService: MasterService, private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getDepartment(crit).subscribe(dt => {
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-department'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent(data) {
    this.router.navigate(['main/admin/set-department/']);
  }
}
