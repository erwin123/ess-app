import { Component, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { AccountService } from 'src/app/services/account.service';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  fields;
  message;
  credential: any;
  constructor(private _dialog: LyDialog, private stateService: StateService,
    private accService: AccountService, private router:Router) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
  }
  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['main/landing']);
    });
  }
  ngOnInit() {
    this.accService.getJSON("change-password.json").subscribe(f => {
      this.fields = f;
    })
  }

  onSubmit(obj) {
    if (obj.valid) {
      this.stateService.setBlocking(1);
      let objPwd = obj.value;
      if (objPwd.NewPassword1 !== objPwd.NewPassword2) {
        this.message = "Password dan konfirmasi tidak sama.";
        setTimeout(() => {
          this.message = ""
        }, 3000);
        return;
      }
      let putObj = {
        Username: this.credential.Username,
        Password: objPwd.CurrentPassword,
        NewPassword1: objPwd.NewPassword1,
        UpdateBy: this.credential.Username
      }
      this.accService.chPwd(putObj).subscribe(ch => {
        if(ch.length){
          this.showAlert("Data tersimpan",false);
        }else{
          this.showAlert("Data gagal disimpan, cek kembali password Anda",true);
        }
      })
    }
  }
}
