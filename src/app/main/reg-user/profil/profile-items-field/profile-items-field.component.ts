import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { LyTheme2, ThemeVariables } from "@alyle/ui";
import { FormGroup } from "@angular/forms";
import { MasterService } from "src/app/services/master.service";
import { forkJoin } from "rxjs";
import * as moment from "moment";

import { StateService } from "src/app/services/state.service";
import { NgxImageCompressService } from "ngx-image-compress";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { DialogInfoComponent } from "src/app/alert/dialog-info/dialog-info.component";
import { EmployeeService } from "src/app/services/employee.service";
import { AccountService } from "src/app/services/account.service";
import { LY_DIALOG_DATA, LyDialogRef, LyDialog } from "@alyle/ui/dialog";
// const STYLES_DIALOG = (theme: ThemeVariables) => ({
//   width: '800px',
//   borderRadius: 0,
//   [theme.getBreakpoint('XSmall')]: {
//     width: '100vw',
//     height: '100vh',
//     maxWidth: '100vw !important',
//     maxHeight: '100vh !important'
//   }
// });
const thmstyles = (_theme: ThemeVariables) => ({
  photoProfile: {
    height: "100px",
    background: "url('../../assets/img/bg-profile.jpg') no-repeat",
    borderBottom: "3px solid #fff",
    backgroundSize: "cover"
  },
  errMsg: {
    color: "red",
    fontWeight: "bold",
    marginTop: "20px",
    textAlign: "center"
  },
  button: {
    width: "100%"
  },
  buttonHalf: {
    width: "48%"
  },
  labelAfter: {
    paddingBefore: "8px"
  },
  iconLarge: {
    fontSize: "20px"
  },
  btnWrapper: {
    display: "block",
    width: "100%",
    marginBottom: "25px",
    marginTop: "50px"
  },
  uploadBtnFile: {
    opacity: "0",
    position: "absolute",
    left: "0",
    top: "0"
  },
  customBadge: {
    after: 0,
    above: 0,
    bottom: 0,
    margin: "auto 0",
    border: `2px solid ${_theme.background.tertiary}`
  }
});
@Component({
  selector: "app-profile-items-field",
  templateUrl: "./profile-items-field.component.html",
  styleUrls: ["./profile-items-field.component.scss"],
  providers: [NgxImageCompressService]
})
export class ProfileItemsFieldComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @Output() addedRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() editedRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelRow: EventEmitter<any> = new EventEmitter<any>();
  @Input("fields") fields;
  @Input("type") type;
  @Input("isTemp") isTemp = true;
  @Input("data") data;
  @Input("empID") empID;
  pickDate = [];
  pickDateModel = "";
  readonly classes = this.theme.addStyleSheet(thmstyles);

  genForm: FormGroup;
  credential: any;
  config: any;

  // files = [];
  // message = '';

  constructor(
    private _dialog: LyDialog,
    private stateService: StateService,
    private imageCompress: NgxImageCompressService,
    private theme: LyTheme2,
    private employeeService: EmployeeService,
    private masterService: MasterService
  ) {
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
          m.value = m.Value || "";
          return m;
        });
      });
    }
    this.genForm = this.stateService.toFormGroup(this.fields);

    if (this.data) {
      setTimeout(() => {
        this.stateService.resetForm(this.genForm, this.data);
      }, 500); // bugs on radio button
    }
  }
  showAlert() {
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        data: {
          MessageTitle: "Konfirmasi Hapus",
          Message: "Anda yakin ingin hapus?",
          err: false,
          ConfirmationMode: true
        }
      }
    );
    dialogRefInfo.afterClosed.subscribe(res => {
      if (res == 1) {
        this.onSubmit(true);
      }
    });
  }
  cancel() {
    this.cancelRow.emit();
  }
  clickPickedDate(key) {
    this.pickDate[key] = true;
  }
  handleDate(event, key) {
    this.pickDate[key] = false;
    this.genForm.get(key).setValue(event.format("YYYY-MM-DD"));
  }

  // readFile(event: any) {
  //   this.message = "";
  //   if (event.target.files && event.target.files[0]) {
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       if (event.target.files[i].size <= 1000000) { this.files.push(event.target.files[i]); }
  //       else {
  //         this.message = "Salah satu atau lebih file lebih besar dari 1MB";
  //       }
  //     }
  //   }
  // }

  // windowOpenDataUrl(file) {
  //   let reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     let win = window.open();
  //     win.document.write('<iframe src="' + e.target.result + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
  //   }
  //   reader.readAsDataURL(file);
  // }

  // deleteFile(file) {
  //   this.message = "";
  //   this.files.splice(this.files.findIndex(f => f.name === file), 1);
  // }

  onSubmit(isDelete?: boolean) {
    // async.every(this.imgFile, (each, callback) => {
    //   if (each !== null) {
    //     this.transact.postUpload(each, "image").subscribe(event => {
    //       let eventRes: any;
    //       if (event.type === HttpEventType.UploadProgress) {
    //         const percentDone = Math.round(100 * event.loaded / event.total);
    //         //this.pdfProgress = percentDone;
    //       }
    //       if (event instanceof HttpResponse) {
    //         eventRes = event.body;
    //         resultUpload.push(eventRes.filename);
    //         callback(null, true);
    //       }
    //     }, err => {
    //       callback(null, false);
    //     });
    //   } else {
    //     callback(null, true);
    //   }
    // }, (err, result) => {
    //   if (result) {
    //   }
    // });

    if (this.genForm.valid) {
      this.stateService.setBlocking(1);
      let obj = this.genForm.value;
      obj.RowStatus = isDelete ? 0 : 1;
      obj.EmployeeID = this.empID;
      if (this.data) obj.Id = this.data.Id;
      switch (this.type) {
        case "Pendidikan":
          if (this.data) {
            if (this.isTemp) {
              this.employeeService.putEmployeeEduTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.putEmployeeEdu(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            }
          } else {
            if (this.isTemp) {
              this.employeeService.postEmployeeEduTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.postEmployeeEdu(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            }
          }
          break;
        case "Pelatihan":
          if (this.data) {
            if (this.isTemp) {
              this.employeeService.putEmployeeTrnTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.putEmployeeTrn(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            }
          } else {
            if (this.isTemp) {
              this.employeeService.postEmployeeTrnTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.postEmployeeTrn(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            }
          }
          break;
        case "Keluarga":
          if (this.data) {
            if (this.isTemp) {
              this.employeeService.putEmployeeFamTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.putEmployeeFam(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.editedRow.emit(this.genForm.value);
              });
            }
          } else {
            if (this.isTemp) {
              this.employeeService.postEmployeeFamTemp(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            } else {
              this.employeeService.postEmployeeFam(obj).subscribe(res => {
                this.stateService.setBlocking(0);
                this.addedRow.emit(this.genForm.value);
              });
            }
          }
          break;
      }
    }
  }
}
