import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { StateService } from 'src/app/services/state.service';
import { LyDialog } from '@alyle/ui/dialog';
import { AccountService } from 'src/app/services/account.service';
import { MasterService } from 'src/app/services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import * as moment from 'moment';
const thmstyles = ({
  msg: {
    color: '#fff',
    fontWeight: 'bold',
    padding: '5px',
    background: '#07096e'
  },
  labelAfter: {
    paddingBefore: '8px'
  }
});
@Component({
  selector: 'app-surat-tugas',
  templateUrl: './surat-tugas.component.html',
  styleUrls: ['./surat-tugas.component.scss']
})
export class SuratTugasComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  credential: any;
  fields = [];
  dataView: any;
  mode = 1;
  message = "";
  title = "Ajukan Surat Tugas";
  app=false;
  constructor(private theme: LyTheme2, private stateService: StateService, private accountService: AccountService,
    private router: Router, private _dialog: LyDialog, private masterService: MasterService, private route: ActivatedRoute) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
  }

  ngOnInit() {
    this.stateService.setBlocking(1);
    this.route.queryParams.subscribe(p => {
      if (p.idabs) {
        this.mode = 2;
        this.title = "Data Surat Tugas "
        this.fetchData(p.idabs, cb => {
          if (cb != null) {
            this.title += cb.SpdNo;
            cb.TanggalAkhir = moment(cb.TanggalAkhir).format('YYYY-MM-DD');
            cb.TanggalAwal = moment(cb.TanggalAwal).format('YYYY-MM-DD');
            this.message = "Total "+moment(cb.TanggalAkhir).diff(cb.TanggalAwal, 'days') + " hari.";
            this.dataView = cb;
            this.fetchField(cb => {
              this.fields = cb
              this.stateService.setBlocking(0);
            })
          }
        });
        if(p.app){
          this.app = true;
        }
      } else {
        this.fetchField(cb => {
          this.fields = cb
          this.stateService.setBlocking(0);
        })
      }
      
    })
  }

  fetchField(callback) {
    this.accountService.getJSON("spd-field.json").subscribe(res => {
      callback(res);
    });
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      if (!err)
        this.router.navigate(['main/landing']);
    });
  }

  fetchData(id, callback) {
    this.masterService.getSpd({ RowStatus: 1, Id: id }).subscribe(data => {
      if (data.length)
        callback(data[0]);
      else
        callback(null);
    })
  }

  goTo(path) {
    this.router.navigate([path]);
  }

  handleChange($event) {
    let obj = $event;
    if (obj.TanggalAkhir && obj.TanggalAwal) {
      if (moment(obj.TanggalAwal).isAfter(obj.TanggalAkhir)) {
        this.message = "Tanggal pulang tidak boleh lebih kecil dari tanggal berangkat"
      } else {
        this.message = "Total "+moment(obj.TanggalAkhir).diff(obj.TanggalAwal, 'days') + " hari.";
      }
    }
  }

  onSubmit($event) {
    this.stateService.setBlocking(1);
    let obj = $event.getRawValue();
    obj.RowStatus = 1;
    obj.ApprStatus = "INIT";
    obj.ApprStep = 1;
    obj.EmployeeID = this.credential.quickProfile.EmployeeID;
    if (moment(obj.TanggalAkhir).isAfter(obj.TanggalAwal)) {
      if ($event.valid) {
        if (this.dataView)
          this.masterService.putSpd(obj).subscribe(upt => {
            this.showAlert("Surat Tugas berhasil diajukan", false);
          });
        else
          this.masterService.postSpd(obj).subscribe(ins => {
            this.showAlert("Surat Tugas berhasil diajukan", false);
          });
      }
    } else {
      this.showAlert("Tanggal pulang tidak boleh lebih kecil dari tanggal berangkat", true);
    }
  }
}
