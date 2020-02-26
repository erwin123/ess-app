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
  selector: 'app-klaim',
  templateUrl: './klaim.component.html',
  styleUrls: ['./klaim.component.scss']
})
export class KlaimComponent implements OnInit {
  readonly classes = this.theme.addStyleSheet(thmstyles);
  credential: any;
  fields = [];
  dataView: any;
  mode = 1;
  title = "Ajukan Klaim";
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
        this.title = "Data Klaim "
        this.fetchData(p.idabs, cb => {
          if (cb != null) {
            this.title += cb.ClaimNo;
            cb.ClaimDate = moment(cb.ClaimDate).format('YYYY-MM-DD');
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
    this.accountService.getJSON("isi-klaim.json").subscribe(res => {
      this.masterService.getClaim({}).subscribe(clt => {
        res.find(f => f.key === 'ClaimType').option = clt ? clt.map(m => {
          m.text = m.Description,
            m.value = m.Id
          return m;
        }).filter(f=>moment().isBetween(f.ValidFrom, f.ValidTo)) : [];
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
      this.router.navigate(['main/landing']);
    });
  }

  fetchData(id, callback) {
    this.masterService.getDocClaim({ RowStatus: 1, Id: id }).subscribe(data => {
      if (data.length)
        callback(data[0]);
      else
        callback(null);
    })
  }

  goTo(path) {
    this.router.navigate([path]);
  }

  handleChange($event){
    // console.log($event)
  }
  onSubmit($event) {
    this.stateService.setBlocking(1);
    let obj = $event.getRawValue();
    obj.RowStatus = 1;
    obj.ApprStatus = "INIT";
    obj.ApprStep = 1;
    obj.ClaimStatus = 'INIT'
    obj.EmployeeID = this.credential.quickProfile.EmployeeID;
    if ($event.valid) {
      if (this.dataView)
        this.masterService.putDocClaim(obj).subscribe(upt => {
          this.showAlert("Klaim berhasil diajukan", false);
        });
      else
        this.masterService.postDocClaim(obj).subscribe(ins => {
          this.showAlert("Klaim berhasil diajukan", false);
        });
    }
  }
}
