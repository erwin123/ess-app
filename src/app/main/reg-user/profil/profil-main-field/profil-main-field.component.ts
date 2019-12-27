import { Component, OnInit, ViewChild, ElementRef, Inject, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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
  selector: 'app-profil-main-field',
  templateUrl: './profil-main-field.component.html',
  styleUrls: ['./profil-main-field.component.scss'],
  providers: [NgxImageCompressService]
})
export class ProfilMainFieldComponent implements OnInit, AfterViewInit {
  @Output() addedRow: EventEmitter<any> = new EventEmitter<any>();
  pickDate = false;
  pickDateModel = "";
  title = "";
  readonly classes = this.theme.addStyleSheet(thmstyles);

  genForm: FormGroup;
  credential: any;
  config: any;
  parser;
  fields = [];
  data = [];
  EmployeeId = 0;
  constructor(@Inject(LY_DIALOG_DATA) public dataParser: any,
    public dialog: LyDialogRef,
    private stateService: StateService,
    private imageCompress: NgxImageCompressService,
    private theme: LyTheme2,
    private employeeService: EmployeeService,
    private masterService: MasterService) {
    this.stateService.currentCredential.subscribe(cr => {
      this.credential = cr;
    });
    this.config = this.stateService.getConfig();
    this.parser = dataParser;
  }

  ngOnInit() {
    this.fields = this.parser.fieldInput;
    this.title = this.parser.objectData;
    this.data = this.parser.data;
    this.EmployeeId = this.parser.EmployeeID;
    console.log(this.parser.data);
    console.log(this.parser.fieldInput)
    this.genForm = this.stateService.toFormGroup(this.fields);
  }

  ngAfterViewInit(){
    this.stateService.resetForm(this.genForm, this.data);
  }

  handleDate(event) {
    this.pickDate = false;
    this.genForm.get("BirthDate").setValue(event.format("YYYY-MM-DD"));
  }

  onSubmit(){
    if(this.genForm.valid){
      let obj = this.genForm.value;
      //obj.Id = this.EmployeeId;
      obj.EmployeeID = this.EmployeeId;
      this.employeeService.postEmployeeTemp(obj).subscribe(res=>{
        if(res){
          this.dialog.close(1);
        }
      })
      // this.employeeService.putEmployee(obj).subscribe(res=>{
      //   if(res){
      //     this.dialog.close(1);
      //   }
      // })
    }
  }
}
