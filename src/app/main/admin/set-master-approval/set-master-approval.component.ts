import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { StateService } from 'src/app/services/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LyDialog } from '@alyle/ui/dialog';
import { MasterService } from 'src/app/services/master.service';
import { AccountService } from 'src/app/services/account.service';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { EmployeeService } from 'src/app/services/employee.service';
const thmstyles = ({
  errMsg: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '20px',
    textAlign: 'center'
  },
  button: {
    width: '100%'
  },
  labelAfter: {
    paddingBefore: '8px'
  }
});
@Component({
  selector: 'app-set-master-approval',
  templateUrl: './set-master-approval.component.html',
  styleUrls: ['./set-master-approval.component.scss']
})
export class SetMasterApprovalComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  config: any;
  fields = [];
  dataView: any;
  constructor(private theme: LyTheme2, private stateService: StateService, private accountService: AccountService,
    private router: Router, private _dialog: LyDialog, private masterService: MasterService,
    private route: ActivatedRoute, private employeeService: EmployeeService) {
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    this.stateService.setBlocking(1);
    this.route.queryParams.subscribe(p => {
      if (p.idabs) {
        this.fetchData(p.idabs, cb => {
          if (cb != null) {
            this.dataView = cb;
            this.fetchField(cb => {
              this.fields = cb
            })
          }
        });
      } else {
        this.fetchField(cb => {
          this.fields = cb
        })
      }
      this.stateService.setBlocking(0);
    })
  }

  fetchField(callback) {
    this.accountService.getJSON("master-approval.json").subscribe(res => {
      this.employeeService.getEmployeeQuickProfileSimple({}).subscribe(appr => {
        res.find(f => f.key === 'EmployeeID').option = appr ? appr.map(m => {
          m.text = "(" + m.Username + ") " + m.FullName,
            m.value = m.EmployeeId
          return m;
        }) : [];
        callback(res);
      })
      
    });
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['main/admin/maintain-masterapproval']);
    });
  }

  fetchData(id, callback) {
    this.masterService.getMasterApproval({ RowStatus: 1, Id: id }).subscribe(data => {
      if (data.length)
        callback(data[0]);
      else
        callback(null);
    })
  }

  onSubmit($event) {
    this.stateService.setBlocking(1);

    if ($event.valid) {
      if (this.dataView)
        this.masterService.putMasterApproval($event.getRawValue()).subscribe(upt => {
          this.showAlert("Data Master Tersimpan", false);
        });
      else
        this.masterService.postMasterApproval($event.getRawValue()).subscribe(ins => {
          this.showAlert("Data Master Tersimpan", false);
        });
    }
  }
}
