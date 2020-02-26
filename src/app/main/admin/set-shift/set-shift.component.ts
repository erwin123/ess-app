import { Component, OnInit } from "@angular/core";

import { LyTheme2 } from "@alyle/ui";
import { StateService } from "src/app/services/state.service";
import { LyDialog } from "@alyle/ui/dialog";
import { AccountService } from "src/app/services/account.service";
import { MasterService } from "src/app/services/master.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogInfoComponent } from "src/app/alert/dialog-info/dialog-info.component";
import * as moment from "moment";

const thmstyles = {
  errMsg: {
    color: "red",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center"
  },
  button: {
    width: "100%"
  },
  labelAfter: {
    paddingBefore: "8px"
  }
};
@Component({
  selector: "app-set-shift",
  templateUrl: "./set-shift.component.html",
  styleUrls: ["./set-shift.component.scss"]
})
export class SetShiftComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  config: any;
  fields = [];
  dataView: any;

  constructor(
    private theme: LyTheme2,
    private stateService: StateService,
    private accountService: AccountService,
    private router: Router,
    private _dialog: LyDialog,
    private masterService: MasterService,
    private route: ActivatedRoute
  ) {
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    this.stateService.setBlocking(1);
    this.route.queryParams.subscribe(p => {
      if (p.Id) {
        this.fetchData(p.Id, cb => {
          if (cb != null) {
            this.dataView = cb;
            this.fetchField(cb => {
              this.fields = cb;
            });
          }
        });
      } else {
        this.fetchField(cb => {
          this.fields = cb;
        });
      }
      this.stateService.setBlocking(0);
    });
  }

  fetchData(Id, callback) {
    this.masterService.getShiftById(Id).subscribe(data => {
      if (data.length) {
        let result = data[0];
        result.ClockIn = moment(result.ClockIn)
          .utc()
          .format("YYYY-MM-DD HH:mm");
        result.ClockOut = moment(result.ClockOut)
          .utc()
          .format("YYYY-MM-DD HH:mm");
        callback(result);
      } else {
        callback(null);
      }
    });
  }

  fetchField(callback) {
    this.accountService.getJSON("master-shift-field.json").subscribe(res => {
      callback(res);
    });
  }

  onSubmit($event) {
    this.stateService.setBlocking(1);

    if ($event.valid) {
      const obj = $event.getRawValue();
      obj.ClockIn = moment(obj.ClockIn).format("YYYY-MM-DD HH:mm");
      obj.ClockOut = moment(obj.ClockOut).format("YYYY-MM-DD HH:mm");
      if (this.dataView) {
        this.masterService.putShift(obj.Id, obj).subscribe(upt => {
          this.showAlert("Data Master Tersimpan", false);
        });
      } else {
        delete obj.Id;
        this.masterService.postShift(obj).subscribe(ins => {
          this.showAlert("Data Master Tersimpan", false);
        });
      }
    }
  }

  showAlert(msg: string, err: boolean) {
    this.stateService.setBlocking(0);
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        data: { Message: msg, err: err }
      }
    );
    dialogRefInfo.afterClosed.subscribe(() => {
      this.router.navigate(["main/admin/maintain-shift"]);
    });
  }
}
