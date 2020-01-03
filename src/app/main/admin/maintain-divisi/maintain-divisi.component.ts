import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-maintain-divisi',
  templateUrl: './maintain-divisi.component.html',
  styleUrls: ['./maintain-divisi.component.scss']
})
export class MaintainDivisiComponent implements OnInit {
  data = [];
  columns = [
    { key: 'Name', title: 'Nama' },
    { key: 'Initial', title: 'Inisial' },
    { key: 'Dept', title:'Sub Function'}
  ];
  constructor(private stateService: StateService, private masterService: MasterService, private router: Router) { }
  ngOnInit() {
    this.fetchData({ RowStatus: 1 });
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getDivision(crit).subscribe(dt => {
      this.data = dt.map(m=>{
        m.Dept = m.Departments.map(d=> {
          return d.Name
        }).join(", ")
        return m;
      });
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-divisi'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent(data) {
    this.router.navigate(['main/admin/set-divisi/']);
  }
}
