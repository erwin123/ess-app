import { Component, OnInit, Inject } from '@angular/core';
import { LyDialogRef, LY_DIALOG_DATA } from '@alyle/ui/dialog';
import * as moment from 'moment';
import * as SecureLS from 'secure-ls';
import { AbsentService } from 'src/app/services/absent.service';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
@Component({
  selector: 'app-edit-absent',
  templateUrl: './edit-absent.component.html',
  styleUrls: ['./edit-absent.component.scss']
})
export class EditAbsentComponent implements OnInit {
  public selectedMoment = new Date();
  min;
  max;
  credential: any;
  ls = new SecureLS();
  constructor(@Inject(LY_DIALOG_DATA) public data: any, public dialogEditAbsent: LyDialogRef,
    private absenService: AbsentService) {
    this.min = moment().subtract(10, 'days').toDate();
    this.max = moment().toDate();
    this.credential = this.ls.get('currentUser');
  }

  ngOnInit() {
  }

  onSave() {
    let myObj = {
      ClockOut: moment(this.selectedMoment).format("YYYY-MM-DD HH:mm:ss"),
      RowStatus: 1,
      UpdateDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      UpdateBy: this.credential.Username,
      Id:this.data.Id
    }
    this.absenService.putAbsent(myObj).subscribe(put=>{
      if(put){
        this.dialogEditAbsent.close(put);
      }
    })
  }
}
