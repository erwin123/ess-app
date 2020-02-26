import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { LyTheme2 } from "@alyle/ui";
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
import { ActivatedRoute } from "@angular/router";
import * as async from "async";
import { LY_DIALOG_DATA, LyDialogRef, LyDialog } from "@alyle/ui/dialog";

const thmstyles = {
  photoProfile: {
    height: "100px",
    background: "url('../../assets/img/bg-profile.jpg') no-repeat",
    borderBottom: "3px solid #fff",
    backgroundSize: "cover"
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
  },
  iconLarge: {
    fontSize: "20px"
  }
};
@Component({
  selector: "app-profil-main-field",
  templateUrl: "./profil-main-field.component.html",
  styleUrls: ["./profil-main-field.component.scss"],
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
  files = [];
  message = "";
  data = [];
  EmployeeId = 0;
  NRP = "";
  constructor(
    @Inject(LY_DIALOG_DATA) public dataParser: any,
    public dialog: LyDialogRef,
    private stateService: StateService,
    private _dialog: LyDialog,
    private cdRef: ChangeDetectorRef,
    private imageCompress: NgxImageCompressService,
    private theme: LyTheme2,
    private employeeService: EmployeeService,
    private masterService: MasterService
  ) {
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
    this.NRP = this.parser.NRP;
    //console.log(this.parser);
    // console.log(this.parser.fieldInput).
    this.files = this.parser.files.filter(f => f.AttachmentType === "KTP");
    if (this.files.length) {
      this.files = this.files.map(m => {
        return {
          filename: m.Filename,
          name: m.Systemname,
          url: this.config.Api.profile + this.parser.NRP + "/" + m.Filename,
          isRealUrl: true
        };
      });
    }
    this.genForm = this.stateService.toFormGroup(this.fields);
  }

  async ngAfterViewInit() {
    this.stateService.resetForm(this.genForm, this.data);
  }

  handleDate(event) {
    this.pickDate = false;
    this.genForm.get("BirthDate").setValue(event.format("YYYY-MM-DD"));
  }

  showAlert(data, callback) {
    const dialogRefInfo = this._dialog.open<DialogInfoComponent>(
      DialogInfoComponent,
      {
        data: data
      }
    );
    dialogRefInfo.afterClosed.subscribe(res => {
      callback(res);
    });
  }

  readFile(event: any) {
    this.message = "";
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size <= 1000000) {
          this.files.push(event.target.files[i]);
        } else {
          this.message = "Salah satu atau lebih file lebih besar dari 1MB";
        }
      }
    }
  }

  windowOpenDataUrl(file) {
    if (file.url) {
      this.downloadFile(file.url, file.name);
    } else {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.downloadFile(e.target.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  downloadFile(url, filename) {
    this.employeeService.downloadFile(url).subscribe(bl => {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(bl);
      a.download = filename;
      a.click();
      this.showAlert(
        {
          MessageTitle: "Informasi",
          Message: "Download berhasil",
          err: false,
          ConfirmationMode: false
        },
        cb => {}
      );
    });
  }

  deleteFile(file) {
    this.message = "";
    this.showAlert(
      {
        MessageTitle: "Konfirmasi Hapus",
        Message: "Anda yakin ingin hapus?",
        err: false,
        ConfirmationMode: true
      },
      cb => {
        if (cb == 1) {
          if (file.filename) {
            //real sudah di db
            this.employeeService
              .putEmployeeAttachTemp({ Filename: file.filename, RowStatus: 0 })
              .subscribe(up => {
                if (up.length) {
                  this.files.splice(
                    this.files.findIndex(f => f.name === file.name),
                    1
                  );
                  this.cdRef.detectChanges();
                }
              });
          } else {
            this.files.splice(
              this.files.findIndex(f => f.name === file.name),
              1
            );
            this.cdRef.detectChanges();
          }
        }
      }
    );
  }

  uploadFile(cb) {
    if (this.files.length > 0) {
      this.stateService.setBlocking(1);
      let resultUpload = [];
      async.every(
        this.files,
        (each, callback) => {
          if (each !== null && !each.isRealUrl) {
            this.employeeService.postUpload(each, "attach", this.NRP).subscribe(
              event => {
                let eventRes: any;
                if (event.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * event.loaded) / event.total
                  );
                  // console.log(percentDone);
                }
                if (event instanceof HttpResponse) {
                  eventRes = event.body;
                  resultUpload.push(eventRes);
                  callback(null, true);
                }
              },
              err => {
                callback(null, false);
              }
            );
          } else {
            callback(null, true);
          }
        },
        (err, result) => {
          if (result) {
            async.every(
              resultUpload.map(m => {
                return {
                  RowStatus: 1,
                  AttachmentType: "KTP",
                  Filename: m.filename,
                  Systemname: m.systemname,
                  EmployeeID: this.EmployeeId
                };
              }),
              (each, callback) => {
                this.employeeService
                  .postEmployeeAttachTemp(each)
                  .subscribe(resUpload => {
                    if (resUpload) {
                      callback(null, true);
                    } else {
                      callback(null, false);
                    }
                  });
              },
              (err, result) => {
                //this.stateService.setBlocking(0);
                // this.showAlert({
                //   MessageTitle: "Informasi",
                //   Message: "Dokumen berhasil diupload",
                //   err: false,
                //   ConfirmationMode: false
                // }, cb => {
                //   this.dialog.close();
                // })
                cb("done");
              }
            );
          }
        }
      );
    } else {
      cb("done");
    }
  }

  onSubmit() {
    if (this.genForm.valid) {
      this.uploadFile(cb => {
        if (cb === "done") {
          let obj = this.genForm.value;
          //obj.Id = this.EmployeeId;
          obj.EmployeeID = this.EmployeeId;
          this.employeeService.postEmployeeTemp(obj).subscribe(res => {
            if (res) {
              this.dialog.close(1);
            }
          });
        } else {
          this.showAlert(
            {
              MessageTitle: "Informasi",
              Message: "Dokumen gagal disimpan",
              err: false,
              ConfirmationMode: false
            },
            cb => {
              this.dialog.close();
            }
          );
        }
      });

      // this.employeeService.putEmployee(obj).subscribe(res=>{
      //   if(res){
      //     this.dialog.close(1);
      //   }
      // })
    }
  }
}
