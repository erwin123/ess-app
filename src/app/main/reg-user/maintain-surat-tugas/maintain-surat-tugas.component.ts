import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { MasterService } from 'src/app/services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-maintain-surat-tugas',
  templateUrl: './maintain-surat-tugas.component.html',
  styleUrls: ['./maintain-surat-tugas.component.scss']
})
export class MaintainSuratTugasComponent implements OnInit {
  data = [];
  columns = [
    { key: 'SpdNo', title: 'Nomor Surat' },
    { key: 'Akomodasi', title: 'Akomodasi' },
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
    this.masterService.getSpd(crit).subscribe(dt => {
      dt.map(m=>{
        m.TanggalAkhir = moment(m.TanggalAkhir).format('YYYY-MM-DD');
        m.TanggalAwal = moment(m.TanggalAwal).format('YYYY-MM-DD');
        return m;
      })
      this.data = dt;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/reg-user/isi-surat-tugas'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent() {
    this.router.navigate(['main/reg-user/isi-surat-tugas']);
  }

}
