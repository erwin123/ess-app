import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbsentService } from 'src/app/services/absent.service';
import { StateService } from 'src/app/services/state.service';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
  selector: 'app-maintain-absence',
  templateUrl: './maintain-absence.component.html',
  styleUrls: ['./maintain-absence.component.scss']
})
export class MaintainAbsenceComponent implements OnInit {
  data = [];
  columns = [
    { key: 'AbsentDate', title: 'Tanggal' },
    { key: 'FullName', title: 'Nama' },
    { key: 'NRP', title: 'NRP' },
    { key: 'ClockIn', title: 'Masuk' },
    { key: 'ClockOut', title: 'Keluar' },
  ];
  tgAwal;
  tgAkhir;
  errMsg = "";
  constructor(private excelService:ExcelService,private absenService: AbsentService, private stateService: StateService, private router: Router) { }
  ngOnInit() {
    //this.fetchData({},{ page: 1, pagesize: 10 });
    this.fetchData({});
  }
  fetchData(crit) {
    this.stateService.setBlocking(1);
    this.absenService.postCriteriaUv(crit).subscribe(emp => {
      emp.map(m => {
        m.ClockIn = m.ClockIn ? m.ClockIn.split('T')[0] + " " + m.ClockIn.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
        m.ClockOut = m.ClockOut ? m.ClockOut.split('T')[0] + " " + m.ClockOut.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
        return m;
      });
      this.data = emp;
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    this.router.navigate(['main/admin/set-absence'], { queryParams: { idabs: data.Id } });
  }
  receiveAddEvent(data) {
    //console.log(data);
    this.router.navigate(['main/admin/set-acc/']);
  }

  exportData() {
    if (this.tgAwal.isAfter(this.tgAkhir)) {
      this.errMsg = "Tanggal awal tidak boleh lebih besar tanggal akhir";
      setTimeout(() => {
        this.errMsg = "";
      }, 3000);
    } else if (this.tgAwal && this.tgAkhir) {
      this.absenService.getSAPRaw({ Awal: this.tgAwal, Akhir: this.tgAkhir }).subscribe(sap => {
        this.excelService.exportAsExcelFile(sap, "export_raw_" + new Date().toISOString().split('T')[0] + "_");
      })
    }
    else {
      this.errMsg = "Tanggal awal/akhir tidak valid";
      setTimeout(() => {
        this.errMsg = "";
      }, 3000);
    }
  }
}
