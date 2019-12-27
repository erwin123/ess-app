import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { MasterService } from 'src/app/services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-maintain-klaim',
  templateUrl: './maintain-klaim.component.html',
  styleUrls: ['./maintain-klaim.component.scss']
})
export class MaintainKlaimComponent implements OnInit {
  data = [];
  columns = [
    { key: 'ClaimNo', title: 'Nomor Claim' },
    { key: 'MasterClaim.Description', title: 'Jenis' },
    { key: 'ApprStatus', title: 'Status' },
  ];
  constructor(private stateService: StateService, private masterService: MasterService,
    private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    if (this.route.snapshot.paramMap.get('reference')) {
      this.fetchData({ RowStatus: 1, EmployeeID: this.route.snapshot.paramMap.get('reference') });
    } else {
      this.fetchData({ RowStatus: 1 });
    }

  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.masterService.getDocClaim(crit).subscribe(dt => {
      dt.map(m=>{
        m.ClaimDate = moment(m.ClaimDate).format('YYYY-MM-DD');
        return m;
      })
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/reg-user/isi-klaim'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent() {
    this.router.navigate(['main/reg-user/isi-klaim']);
  }
}
