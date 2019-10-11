import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-maintain-employee',
  templateUrl: './maintain-employee.component.html',
  styleUrls: ['./maintain-employee.component.scss']
})
export class MaintainEmployeeComponent implements OnInit {
  data = [];
  columns = [
    { key: 'FullName', title: 'Nama' },
    { key: 'Username', title: 'NRP' },
    { key: 'LevelName', title: 'Jabatan' },
    { key: 'DepartmentName', title: 'Departement' }
  ];
  constructor(private empService: EmployeeService, private router: Router) { }
  ngOnInit() {
    //this.fetchData({},{ page: 1, pagesize: 10 });
    this.fetchData({RowStatus:1},null);
  }
  fetchData(crit,paging) {
    this.empService.getEmployeeQuickProfile(crit, paging).subscribe(emp => {
      this.data = emp;
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-acc'], { queryParams: { emp: data.Username } });
  }
  receiveAddEvent(data) {
    //console.log(data);
    this.router.navigate(['main/admin/set-acc/']);
  }
  receivePagingEvent(paging) {
    this.fetchData({},paging);
  }
  receiveSearchEvent(search) {
    this.fetchData({},{});
  }
}
