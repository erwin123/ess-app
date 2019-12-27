import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintain-approval',
  templateUrl: './maintain-approval.component.html',
  styleUrls: ['./maintain-approval.component.scss']
})
export class MaintainApprovalComponent implements OnInit {
  data = [];
  columns = [
    { key: 'AppType', title: 'Tipe' },
    { key: 'StepNumber', title: 'Step Ke' },
    { key: 'Employee.FullName', title: 'Approval Ke' }
  ];
  constructor(private stateService: StateService, private masterService: MasterService,
    private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getMasterApproval(crit).subscribe(dt => {
      // dt.map(m=>{
      //   m.EmployeeID = 
      // })
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-master-approval'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent() {
    this.router.navigate(['main/admin/set-master-approval/']);
  }

}
