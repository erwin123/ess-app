import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { StateService } from 'src/app/services/state.service';
import { LyDialog } from '@alyle/ui/dialog';
import { AccountService } from 'src/app/services/account.service';
import { MasterService } from 'src/app/services/master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
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
  selector: 'app-set-department',
  templateUrl: './set-department.component.html',
  styleUrls: ['./set-department.component.scss']
})
export class SetDepartmentComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  config: any;
  fields = [];
  dataView: any;
  constructor(private theme: LyTheme2, private stateService: StateService, private accountService: AccountService,
    private router: Router, private _dialog: LyDialog, private masterService: MasterService, private route: ActivatedRoute) {
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
    this.masterService.getDivision({ RowStatus: 1 }).subscribe(div => {
      this.accountService.getJSON("department-field.json").subscribe(res => {
        res.find(f => f.key === 'DivisionID').option = div ? div.map(m => {
          m.text = m.Name,
            m.value = m.Id
          return m;
        }) : [];
        callback(res);
      });
    })

  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['main/admin/maintain-department']);
    });
  }

  fetchData(id, callback) {
    this.masterService.getDepartment({ RowStatus: 1, Id: id }).subscribe(data => {
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
        this.masterService.putDepartment($event.getRawValue()).subscribe(upt => {
          this.showAlert("Data Master Tersimpan", false);
        });
      else
        this.masterService.postDepartment($event.getRawValue()).subscribe(ins => {
          this.showAlert("Data Master Tersimpan", false);
        });
    }
  }

}
