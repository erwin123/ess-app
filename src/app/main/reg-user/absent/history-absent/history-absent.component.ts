import { Component, OnInit } from '@angular/core';
import { AbsentService } from 'src/app/services/absent.service';
import { StateService } from 'src/app/services/state.service';
import * as moment from 'moment';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyDialog } from '@alyle/ui/dialog';
import { EditAbsentComponent } from '../edit-absent/edit-absent.component';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { ActivatedRoute } from '@angular/router';

const STYLES = (_theme: ThemeVariables) => ({
  statusData: {
    color: '#203072'
  }
});

@Component({
  selector: 'app-history-absent',
  templateUrl: './history-absent.component.html',
  styleUrls: ['./history-absent.component.scss']
})
export class HistoryAbsentComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(STYLES);
  credential: any;
  quickProfile: any;
  data = [];
  title="7 Riwayat Absen";
  constructor(private absenService: AbsentService, private stateService: StateService,
    private theme: LyTheme2, private _dialog: LyDialog, private route:ActivatedRoute) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
      this.quickProfile = cr.quickProfile;
    })
  }

  ngOnInit() {
    if(this.route.snapshot.paramMap.get('lembur')==="1"){
      this.title = "7 Riwayat Lembur";
      this.fetchData(true);
    }else{
      this.fetchData();
    }
    
  }

  fetchData(lembur?) {
    this.stateService.setBlocking(1);
    let fetcher = lembur ? this.absenService.getLastHistory(7, moment().format("YYYY-MM-DD"), this.quickProfile.EmployeeID, true) : this.absenService.getLastHistory(8, moment().format("YYYY-MM-DD"), this.quickProfile.EmployeeID);
    fetcher.subscribe(last8 => {
      this.data = last8.map(m => {
        m.ClockIn = m.ClockIn ? m.ClockIn.split('T')[0] + " " + m.ClockIn.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
        m.ClockOut = m.ClockOut ? m.ClockOut.split('T')[0] + " " + m.ClockOut.split('T')[1].replace('.000Z', '') : "-Belum Absen-";
        return m;
      });
      this.stateService.setBlocking(0);
    })
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.fetchData();
    });
  }

  showEdit(obj) {
    this.stateService.setBlocking(0);
    const dialogEdit = this._dialog.open<EditAbsentComponent>(EditAbsentComponent, {
      data: obj
    });
    dialogEdit.afterClosed.subscribe((res) => {
      if (res) {
        this.showAlert("Koreksi berhasil diajukan", false);
      }
    });
  }
}
