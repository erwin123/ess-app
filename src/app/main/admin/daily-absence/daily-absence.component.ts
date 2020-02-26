import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbsentService } from "src/app/services/absent.service";
import { StateService } from "src/app/services/state.service";
import { LyTheme2, ThemeVariables } from "@alyle/ui";
import { AccountService } from "src/app/services/account.service";
import { LyDialog } from "@alyle/ui/dialog";
import { DialogInfoComponent } from "src/app/alert/dialog-info/dialog-info.component";
import * as moment from "moment";
const thmstyles = () => ({
  container: {
    maxWidth: "100%"
  },
  mapContainer: {
    height: "200px !important"
  },
  button: {
    width: "45%"
  }
});
const STYLES_DIALOG = (theme: ThemeVariables) => ({
  width: "800px",
  borderRadius: 0,
  [theme.getBreakpoint("XSmall")]: {
    width: "100vw",
    height: "100vh",
    maxWidth: "100vw !important",
    maxHeight: "100vh !important"
  }
});
@Component({
  selector: "app-daily-absence",
  templateUrl: "./daily-absence.component.html",
  styleUrls: ["./daily-absence.component.scss"]
})
export class DailyAbsenceComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  data;
  dataView = [];
  dataMapIn;
  dataMapOut;
  credential;
  config;
  fields;
  approveMode = false;
  lembur = false;
  mode = 2;
  constructor(
    private _dialog: LyDialog,
    private absenService: AbsentService,
    private theme: LyTheme2,
    private accService: AccountService,
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.config = this.stateService.getConfig();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.stateService.currentCredential.subscribe(cr => {
        this.credential = cr;
        if (cr.Role == "ESS_REG" && !p.apabs && !p.lembur) {
          this.mode = 1;
        }
      });
      if (p.idabs && p.lembur) {
        this.fetchDataUv(
          { Id: p.idabs },
          cb => {
            if (cb.Status == 2 && p.apabs == 1) {
              this.approveMode = true;
              this.lembur = true;
            }
          },
          true
        );
      } else if (p.idabs) {
        this.fetchDataUv({ Id: p.idabs }, cb => {
          if (cb.Status == 2 && p.apabs == 1) {
            this.approveMode = true;
          }
        });
      }
    });
  }

  onSubmit(data) {
    const objPut = {
      Id: this.data.Id,
      ClockIn: moment(data.value.ClockIn).format("YYYY-MM-DD HH:mm"),
      ClockOut: moment(data.value.ClockOut).format("YYYY-MM-DD HH:mm"),
      Status: 3
    };
    this.absenService.putAbsent(objPut, this.data.EmployeeID).subscribe(res => {
      if (res) {
        this.showBox("Data berhasil disimpan", false, () => {
          this.router.navigate(["main/admin/maintain-absence"]);
        });
      }
    });
  }

  fetchDataUv(crit, callback, lembur?) {
    this.stateService.setBlocking(1);
    let fetcher = lembur
      ? this.absenService.postCriteriaUv(crit, lembur)
      : this.absenService.postCriteriaUv(crit);
    fetcher.subscribe(emp => {
      let absentDate = parseInt(
        emp[0].AbsentDate.substring(
          emp[0].AbsentDate.length - 2,
          emp[0].AbsentDate.length
        )
      );
      if (new Date().getDate() - absentDate > 3) {
        this.mode = 2;
      }
      if (emp.length) {
        this.dataView = emp.map(m => {
          m.ClockIn = m.ClockIn
            ? m.ClockIn.split("T")[0] +
              " " +
              m.ClockIn.split("T")[1].replace(".000Z", "")
            : "-Belum Absen-";
          m.ClockOut = m.ClockOut
            ? m.ClockOut.split("T")[0] +
              " " +
              m.ClockOut.split("T")[1].replace(".000Z", "")
            : "-Belum Absen-";
          m.PhotoIn = m.PhotoIn
            ? this.config.Api.absen + "/" + m.PhotoIn
            : null;
          m.PhotoOut = m.PhotoOut
            ? this.config.Api.absen + "/" + m.PhotoOut
            : null;
          return {
            FullName: m.FullName,
            AbsentDate: m.AbsentDate,
            ClockIn: m.ClockIn,
            ClockOut: m.ClockOut,
            NRP: m.NRP,
            EmpLocName: m.EmpLocName
          };
        })[0];
        this.data = emp[0];
        this.setupMap(this.data);
        this.accService.getJSON("absen-field.json").subscribe(f => {
          this.fields = f;
        });
        callback(emp[0]);
        this.stateService.setBlocking(0);
      }
    });
  }

  setupMap(data) {
    this.dataMapIn = {
      Identity: "dataMapIn",
      LocOffice: [Number(data.EmpLong), Number(data.EmpLat)],
      RadiusOffice: Number(data.EmpRadius),
      LocUser: [Number(data.LongIn), Number(data.LatIn)]
    };
    this.dataMapOut = {
      Identity: "dataMapOut",
      LocOffice: [Number(data.EmpLong), Number(data.EmpLat)],
      RadiusOffice: Number(data.EmpRadius),
      LocUser: [Number(data.LongOut), Number(data.LatOut)]
    };
  }

  actionData(a) {
    if (a == 0) {
      this.showAlert(
        {
          Subject: "Konfirmasi",
          Message:
            "Anda yakin menolak absen ini?<br><b>(*) Dengan melakukan penolakan, maka karyawan dianggap tidak masuk</b>",
          ConfirmationMode: true
        },
        true,
        cb => {
          if (cb == 1) {
            this.putData(0, cb => {
              if (cb) {
                this.showBox("Data berhasil disimpan", false, () => {
                  this.router.navigate(["main/inbox"]);
                });
              }
            });
          }
        }
      );
    } else {
      this.putData(3, cb => {
        if (cb) {
          this.showBox("Data berhasil disimpan", false, () => {
            this.router.navigate(["main/inbox"]);
          });
        }
      });
    }
  }

  showBox(message: string, err: boolean, callback) {
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        data: { Message: message, err: err }
      }
    );
    dialogRefInfo.afterClosed.subscribe(() => {
      callback();
    });
  }
  putData(isApprove, callback) {
    let putter = this.lembur
      ? this.absenService.putAbsent(
          { Id: this.data.Id, Status: isApprove },
          this.data.EmployeeID,
          true
        )
      : this.absenService.putAbsent(
          { Id: this.data.Id, Status: isApprove },
          this.data.EmployeeID
        );
    putter.subscribe(res => {
      callback(res);
    });
  }

  showAlert(data: any, err: boolean, callback) {
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        containerClass: this.theme.style(STYLES_DIALOG),
        data: {
          MessageTitle: data.Subject,
          Message: data.Message,
          err: err,
          ConfirmationMode: data.ConfirmationMode
            ? data.ConfirmationMode
            : false
        }
      }
    );
    dialogRefInfo.afterClosed.subscribe(res => {
      callback(res);
    });
  }
}
