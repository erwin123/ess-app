import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateService } from 'src/app/services/state.service';
import { AccountService } from 'src/app/services/account.service';
import { LyTheme2 } from '@alyle/ui';
import { MasterService } from 'src/app/services/master.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import * as moment from 'moment';
import { LyDialog } from '@alyle/ui/dialog';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { callbackify } from 'util';
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
  selector: 'app-set-account',
  templateUrl: './set-account.component.html',
  styleUrls: ['./set-account.component.scss']
})
export class SetAccountComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  readonly classes = this.theme.addStyleSheet(thmstyles);
  accForm: FormGroup;
  config: any;
  fields = [];
  employeeID = 0;
  params;
  dataView: any;
  constructor(private theme: LyTheme2, private stateService: StateService,
    private route: ActivatedRoute, private _dialog: LyDialog, private router: Router,
    private employeeService: EmployeeService, private accountService: AccountService,
    private masterService: MasterService) {
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    this.accountService.getJSON("acc-field.json").subscribe(fl => {
      //this.accForm = this.stateService.toFormGroup(res);
      //this.fields = fl;
      if (fl) {
        this.fetchParameter(fl, cb => {
          this.route.queryParams.subscribe(params => {
            if (params.emp) { //view

              this.params = params.emp;
              this.stateService.setBlocking(1);
              this.employeeService.getEmployeeQuickProfile({ Username: params.emp }, null).subscribe(res => {
                if (res) {
                  this.employeeID = res[0].EmployeeID;
                  //this.fetchParameter();
                  this.dataView = res.map(m => {
                    return {
                      RowStatus: m.RowStatus,
                      Username: m.Username,
                      FullName: m.FullName,
                      Gender: m.Gender,
                      LocationID: m.LocationID,
                      EmailPrivate: m.EmailPrivate,
                      DepartmentID: m.DepartmentID,
                      DivisionID: m.DivisionID,
                      JoinDate: m.JoinDate,
                      ContractPeriode: m.ContractPeriode,
                      EmployeeStatus: m.EmployeeStatus,
                      DirectReportID: m.DirectReportID,
                      OrganizationLevelID: m.OrganizationLevelID,
                      ClockIn: moment(m.ClockIn).utc().format("YYYY-MM-DD HH:mm"),
                      ClockOut: moment(m.ClockOut).utc().format("YYYY-MM-DD HH:mm"),
                      Role: m.Role
                    }
                  })[0];
                  this.fields = fl;
                  //this.stateService.resetForm(this.accForm, acc);
                  this.stateService.setBlocking(0);
                }
              })
            } else {
              this.fields = fl;
            }
          });
        });

      }
    })
  }

  fetchParameter(fields, callback) {
    let master = forkJoin(
      this.masterService.getDivision({}),
      this.masterService.getTitle({}),
      this.masterService.getLocation({}),
      this.employeeService.getEmployeeQuickProfileSimple({})
    )
    master.subscribe(res => {
      fields.find(f => f.key === 'DivisionID').option = res[0] ? res[0].map(m => {
        m.text = m.Name,
          m.value = m.Id
        return m;
      }) : [];
      //get child of division
      let Departments = [];
      res[0].map(m => {
        Departments.push(...m.Departments);
      })
      fields.find(f => f.key === 'DepartmentID').option = res[0] ? Departments.map(m => {
        m.text = m.Name,
          m.value = m.Id
        return m;
      }) : [];
      //end get
      fields.find(f => f.key === 'OrganizationLevelID').option = res[1] ? res[1].map(m => {
        m.text = m.Name,
          m.value = m.Id
        return m;
      }) : [];
      fields.find(f => f.key === 'LocationID').option = res[2] ? res[2].map(m => {
        m.text = m.LocationName,
          m.value = m.Id
        return m;
      }) : [];
      fields.find(f => f.key === 'DirectReportID').option = res[3] ? res[3].map(m => {
        m.text = "(" + m.Username + ") " + m.FullName,
          m.value = m.EmployeeId
        return m;
      }).filter(f => f.Username !== this.params) : [];
    }, err => { }, () => {
      callback(fields);
    });
  }
  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(DialogInfoComponent, {
      data: { Message: msg, err: err }
    });
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(['main/admin/maintain-employee']);
    });
  }
  checkProfile() {
    this.router.navigate(['main/reg-user/profile-main/' + this.params]);
  }
  resetPassword() {
    if (this.dataView) {
      this.accountService.resetPwd(this.dataView).subscribe(res => {
        this.showAlert("Password baru telah dikirim email pribadi", false);
      })
    }
  }
  onSubmit($event) {
    if ($event.valid) {
      //if (this.accForm.valid) {
      let objInsert = $event.value;
      objInsert.ClockIn = moment(objInsert.ClockIn).format("YYYY-MM-DD HH:mm:ss");
      objInsert.ClockOut = moment(objInsert.ClockOut).format("YYYY-MM-DD HH:mm:ss");
      if (this.employeeID > 0) {
        objInsert.Id = this.employeeID;
        this.accountService.putAccount({ Username: objInsert.Username, Role: objInsert.Role }).subscribe();
        delete objInsert.Username;
        delete objInsert.Role;
        this.employeeService.putEmployee(objInsert).subscribe(ins => {
          if (ins) {
            this.showAlert("Data tersimpan", false);
          }
        }, err => {
          console.log(err)
          if (err.error.error === "not_unique") {
            this.showAlert("Data tidak tersimpan, NRP sudah terdaftar sebelumnya", true);
          }
        })
      } else {
        this.employeeService.postEmployeeAccount(objInsert).subscribe(ins => {
          if (ins) {
            this.showAlert("Data tersimpan, password dikirim ke email karyawan", false);
          }
        }, err => {
          console.log(err)
          if (err.error.error === "not_unique") {
            this.showAlert("Data tidak tersimpan, NRP sudah terdaftar sebelumnya", true);
          }
        })
      }
    }
  }
}
