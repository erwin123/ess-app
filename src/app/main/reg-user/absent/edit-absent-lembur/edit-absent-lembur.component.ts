import { Component, OnInit, Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import * as moment from 'moment';
import { AbsentService } from 'src/app/services/absent.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-edit-absent-lembur',
  templateUrl: './edit-absent-lembur.component.html',
  styleUrls: ['./edit-absent-lembur.component.scss']
})
export class EditAbsentLemburComponent implements OnInit {
  public selectedMoment = new Date();
  min;
  max;
  credential: any;
  constructor(@Inject(LY_DIALOG_DATA) public data: any, public dialogEditAbsent: LyDialogRef,
    private absenService: AbsentService, private stateService: StateService) {
    // this.min = moment().subtract(10, 'days').toDate();
    // this.max = moment().toDate();
    this.stateService.currentCredential.subscribe(cr => {
      this.min = moment().subtract(10, 'days');
      this.max = moment();
      this.credential = cr;
    })

  }

  ngOnInit() {
  }

  onSave() {
    let myObj = {
      ClockOut: moment(this.selectedMoment).format("YYYY-MM-DD HH:mm:ss"),
      RowStatus: 1,
      Status: 2,
      UpdateDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      UpdateBy: this.credential.Username,
      Id: this.data.Id
    }
    this.absenService.putAbsent(myObj, this.credential.quickProfile.EmployeeID, true).subscribe(put => {
      if (put) {
        this.dialogEditAbsent.close(put);
      }
    })
  }
}
