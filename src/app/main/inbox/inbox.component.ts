import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { StateService } from 'src/app/services/state.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { ThemeVariables, LyTheme2 } from '@alyle/ui';
const STYLES_DIALOG = (theme: ThemeVariables) => ({
  width: '800px',
  borderRadius: 0,
  [theme.getBreakpoint('XSmall')]: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw !important',
    maxHeight: '100vh !important'
  }
});
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  data = [];
  columns: Columns[] = [
    { key: '', title: '', width: '5%' },
    { key: 'Employee.FullName', title: 'Pengirim', width: '20%' },
    { key: 'Subject', title: 'Subject', width: '50%' },
    { key: 'CreateDate', title: 'Tanggal', width: '25%' }
  ];
  credential: any;
  constructor(private theme: LyTheme2, private _dialog: LyDialog,
    private empService: EmployeeService, private route: ActivatedRoute, private stateService: StateService) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('id'));
    if (this.route.snapshot.paramMap.get('id')) {

      switch (this.route.snapshot.paramMap.get('id')) {
        case '1': //Berhasil
          this.showAlert({
            MessageTitle: "Informasi",
            Message: "Data berhasil disetujui",
            ConfirmationMode: false
          }, false,(cb)=>{})
          break;
        case '2': //Ditolak
          this.showAlert({
            MessageTitle: "Informasi",
            Message: "Penolakan data berhasil",
            ConfirmationMode: false
          }, false, (cb)=>{})
          break;
        case '3': //Ditolak
          this.showAlert({
            MessageTitle: "Informasi",
            Message: "Request expired",
            ConfirmationMode: false
          }, false, (cb)=>{})
          break;
        default:
          break;
      }
    }
    this.fetchData();
  }
  fetchData() {
    this.stateService.setBlocking(1);
    this.empService.getMessage({ Receiver: this.credential.quickProfile.EmployeeID }).subscribe(msg => {
      this.data = msg.map(m => {
        m.CreateDate = m.CreateDate ? m.CreateDate.split('T')[0] + " " + m.CreateDate.split('T')[1].replace('.000Z', '') : "";
        return m;
      });
      this.stateService.setBlocking(0);
    });
  }
  receiveEvent(data) {
    let objPut = data;
    data.ReadIt = 1;
    this.empService.putMessage(objPut).subscribe();
    this.showAlert(data, false, (cb) => {
      this.data.splice(this.data.findIndex(f => f.Id == data.Id), 1, data);
    });
  }
  receiveAddEvent(data) {
    console.log(data);
  }
  receiveDeleteEvent(data) {
    this.showAlert({ Subject: "Konfirmasi", Message: "Anda yakin menghapus pesan ini?", ConfirmationMode: true }, true, (cb) => {
      if (cb == 1) {
        let objPut = data;
        data.RowStatus = 0;
        this.empService.putMessage(objPut).subscribe(del => {
          this.fetchData();
        });
      }
    })
  }

  showAlert(data: any, err: boolean, callback?) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      containerClass: this.theme.style(STYLES_DIALOG),
      data: { MessageTitle: data.Subject, Message: data.Message, err: err, ConfirmationMode: data.ConfirmationMode ? data.ConfirmationMode : false }
    });
    dialogRefInfo.afterClosed.subscribe((res) => {
      callback(res);
    });
  }
}
