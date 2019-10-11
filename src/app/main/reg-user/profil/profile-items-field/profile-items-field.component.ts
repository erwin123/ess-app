import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { LyTheme2, } from '@alyle/ui';
import { FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { StateService } from 'src/app/services/state.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DialogInfoComponent } from 'src/app/alert/dialog-info/dialog-info.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { AccountService } from 'src/app/services/account.service';
import { ActivatedRoute } from '@angular/router';
import { LY_DIALOG_DATA, LyDialogRef } from '@alyle/ui/dialog';
const thmstyles = ({
  photoProfile: {
    height: '100px',
    background: "url('../../assets/img/bg-profile.jpg') no-repeat",
    borderBottom: "3px solid #fff",
    backgroundSize: 'cover'
  },
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
  },
  iconLarge: {
    fontSize: '20px'
  },
});
@Component({
  selector: 'app-profile-items-field',
  templateUrl: './profile-items-field.component.html',
  styleUrls: ['./profile-items-field.component.scss'],
  providers: [NgxImageCompressService]
})
export class ProfileItemsFieldComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @Output() addedRow: EventEmitter<any> = new EventEmitter<any>();
  @Input('fields') fields;
  @Input('type') type;
  pickDate=false;
  pickDateModel="";
  readonly classes = this.theme.addStyleSheet(thmstyles);

  genForm: FormGroup;
  credential: any;
  config: any;

  constructor(private stateService: StateService, private imageCompress: NgxImageCompressService,
    private theme: LyTheme2, private employeeService: EmployeeService, private masterService: MasterService) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
    this.config = this.stateService.getConfig();
  }

  ngOnInit() {
    if (this.type === "Keluarga") {

      this.masterService.getEnum({ Code: "FAMREL" }).subscribe(res => {
        this.fields.find(f => f.key === "Relation").option = res.map(m => {
          m.text = m.Text;
          m.value = m.Value;
          return m;
        })

      })
    }
    this.genForm = this.stateService.toFormGroup(this.fields);

  }
  handleDate(event) {
    this.pickDate = false;
    this.genForm.get("BirthDate").setValue(event.format("YYYY-MM-DD"));
  }
  onSubmit() {
    if (this.genForm.valid) {
      let obj = this.genForm.value;
      obj.RowStatus = 1;
      obj.EmployeeID = this.credential.quickProfile.EmployeeID;
      switch (this.type) {
        case "Pendidikan":
          this.employeeService.postEmployeeEduTemp(obj).subscribe(res => {
            this.addedRow.emit(this.genForm.value);
          })
          break;
        case "Pelatihan":
          this.employeeService.postEmployeeTrnTemp(obj).subscribe(res => {
            this.addedRow.emit(this.genForm.value);
          })
          break;
        case "Keluarga":
          this.employeeService.postEmployeeFamTemp(obj).subscribe(res => {
            this.addedRow.emit(this.genForm.value);
          })
          break;
      }

    }
  }
}
